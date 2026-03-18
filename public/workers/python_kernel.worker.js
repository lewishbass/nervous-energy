
// creates a python worker with its own distinct pyodide instance
// allows for isolated execution, and blocking calls without freezing the main UI thread

/* --- Types --- */

// VariableSummary
// - name:string
// - type:string
// - json: json dump of value if possible, otherwise null
// - repr: repr of value
// - callable:boolean
// - id: string using id()

// Tracks
// - _expanded_variables: set of variable paths to expand, e.g. {'my_dict', 'my_dict.key1'}
// - _current_code_filename: only trace lines in the currently executed file


/* --- Receive Types --- */

//  execute
// - code:string
// - codeId: unique id for this execution, used to match results
// - context: 'user' | 'system'

// flow_control
// - flowAction: 'pause' | 'resume' | 'step' | 'stop'
// - newSpeed: number (seconds between trace steps)

// expand / collapse
// - path: string (dot-separated variable path)

// lock
// - taskId: unique id to pair editor and single python execution process

// unlock
// - removes task id and resets python context


/* --- Post Types --- */

// execution_complete
// - codeId, dill (Uint8Array of dill-pickled locals), stdout (string[]), stderr (string[]),
//   executionTime (ms), error (string|null)

// trace
// - line: number, frames: [{name, locals: {path: VariableSummary}}]

// stdout  { text }
// stderr  { text }

// variableinfo
// - path: string, children: {path: VariableSummary}


importScripts("https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js");

let pyodide = null;
let initialized = false;
let currentTaskId = null;
let executing = false;

// flow control state
let paused = false;
let stepping = false;   // when true, execute one trace then pause
let stopped = false;     // hard stop flag

// pending expands to resolve after execution ends
let pendingExpands = [];

const PIP_INSTALL_DILL = `
import micropip as _mp
await _mp.install("dill")
`;

const INIT_PYTHON_SCRIPT = `
import json as _json, dill as _dill, sys as _sys, time as _time, traceback as _tb, textwrap as _textwrap
_user_vars = {}
_current_code_filename = None
_expanded_variables = set()
_sleep_time = 0.3
_paused = False
_stepping = False
_stopped = False
_run_history = []
_frame_stack = []
`;

const LOCAL_SUMMARY_SCRIPT = `
def _summarise_variable(var, path, expanded_variables):
    try:
        var_json = _json.dumps(var)
    except:
        var_json = None

    try:
        var_repr = repr(var)
        if len(var_repr) > 200:
            var_repr = var_repr[:197] + '...'
    except:
        var_repr = '<error>'

    var_type = type(var).__name__
    is_callable = callable(var)
    var_id = str(id(var))

    var_info = {
        "name": path,
        "type": var_type,
        "json": var_json,
        "repr": var_repr,
        "callable": is_callable,
        "id": var_id
    }

    children = {}
    if path in expanded_variables:
        for attr in dir(var):
            if attr.startswith("_"):
                continue
            try:
                child = getattr(var, attr)
                children.update(_summarise_variable(child, path + "." + attr, expanded_variables))
            except:
                pass
    result = dict(children)
    result[path] = var_info
    return result


def _summarize_frame(locals_dict, expanded_vars):
    summary = {}
    for var_name, var_value in locals_dict.items():
        if var_name.startswith("_"):
            continue
        summary.update(_summarise_variable(var_value, var_name, expanded_vars))
    return summary
`;

const TRACE_SCRIPT = `
def _trace_function(frame, event, arg):
    global _paused, _stepping, _stopped, _frame_stack

    if _stopped:
        raise KeyboardInterrupt("Execution stopped by user")

    fname = frame.f_code.co_filename
    if not fname or not fname.startswith('<playground'):
        return _trace_function

    if event not in ('line', 'call', 'return'):
        _time.sleep(_sleep_time/2)
        return _trace_function

    # collect frame stack up to the wrapper
    frames = [frame]
    f = frame.f_back
    while f and f.f_code.co_name != '_exec_wrapper':
        frames.append(f)
        f = f.f_back

    _frame_stack = frames

    expanded = globals().get('_expanded_variables', set())
    frame_summaries = []
    frame_names = []
    for fr in frames:
        frame_expanded = {k.split('|')[1] for k in expanded if k.startswith(fr.f_code.co_name)}
        frame_names.append(fr.f_code.co_name)
        frame_summaries.append(_summarize_frame(fr.f_locals, frame_expanded))

    line = frame.f_lineno
    _js_trace_cb(_json.dumps({
        "line": line,
        "frameNames": frame_names,
        "frameSummaries": frame_summaries,
        "expanded_variables": list(expanded),
    }))

    if _stopped:
        raise KeyboardInterrupt("Execution stopped by user")

    # blocking sleep for visible stepping
    while _paused and not _stopped:
        if _stepping:
            _stepping = False
            break
        _time.sleep(0.05)
    else:
        _time.sleep(_sleep_time)


    return _trace_function
`;

const RT_OUT_SCRIPT = `
class _RTOut:
    """Realtime stdout/stderr redirect that posts to JS and keeps history."""
    def __init__(self, cb, stype):
        self._cb = cb
        self._type = stype
        self._buf = ''
        self._hist = []
    def write(self, text):
        self._buf += text
        while '\\n' in self._buf:
            line, self._buf = self._buf.split('\\n', 1)
            self._cb(line, self._type)
            self._hist.append(line)
    def flush(self):
        if self._buf:
            self._cb(self._buf, self._type)
            self._hist.append(self._buf)
            self._buf = ''
    def clear_history(self):
        self._hist.clear()
`;

const EXEC_WRAPPER_SCRIPT = `
def _exec_wrapper(code_str, run_id):
    _code_obj = compile(code_str, f'<playground{run_id}>', 'exec')
    _local = {}
    exec(_code_obj, globals(), _local)
    return _local
`;

function resetPyodideContext() {
  if (pyodide) {
    pyodide.runPython(`
if '_user_vars' in dir():
    for _k in list(_user_vars.keys()):
        if _k in globals():
            del globals()[_k]
_user_vars = {}
_current_code_filename = None
#_expanded_variables = set()
_paused = False
_stepping = False
_stopped = False
`);
  }
}


async function init() {
  try {
    pyodide = await loadPyodide();
    // initial stdout/stderr before _RTOut is ready (init phase only)
  
    await pyodide.loadPackage(['micropip']);
    await pyodide.runPythonAsync(PIP_INSTALL_DILL);
    await pyodide.runPythonAsync(INIT_PYTHON_SCRIPT);
    await pyodide.runPythonAsync(LOCAL_SUMMARY_SCRIPT);
    await pyodide.runPythonAsync(TRACE_SCRIPT);
    await pyodide.runPythonAsync(RT_OUT_SCRIPT);
    await pyodide.runPythonAsync(EXEC_WRAPPER_SCRIPT);

    // register JS callbacks for Python to call
    pyodide.globals.set('_js_trace_cb', (jsonStr) => {
      const data = JSON.parse(jsonStr);
      self.postMessage({ type: "trace", taskId: currentTaskId, ...data });
    });

    // callback for Python trace to pick up pending JS-side expand paths
    pyodide.globals.set('_js_get_pending_expands', () => {
      if (pendingExpands.length === 0) return [];
      const paths = pendingExpands.splice(0);
      return paths;
    });
    pyodide.globals.set('_js_print_cb', (text, stype) => {
      self.postMessage({ type: stype, taskId: currentTaskId, text });
    });

    // wire up _RTOut as sys.stdout / sys.stderr so print() goes through it
    await pyodide.runPythonAsync(`
_rt_stdout = _RTOut(_js_print_cb, 'stdout')
_rt_stderr = _RTOut(_js_print_cb, 'stderr')
_sys.stdout = _rt_stdout
_sys.stderr = _rt_stderr
`);

    initialized = true;
    self.postMessage({ type: "ready", taskId: currentTaskId });
  } catch (err) {
    self.postMessage({ type: "error", taskId: currentTaskId, text: `Init failed: ${err.message}` });
  }
}

const handleExecuteRequest = async (code, codeId, codeContext, startPaused = false) => {
  if (!initialized) {
    self.postMessage({ type: "error", taskId: currentTaskId, text: "Worker not initialized for execution" });
    return;
  }

  // reset flow control, optionally starting in paused+stepping state
  stopped = false;
  if (startPaused) {
    paused = true;
    stepping = true;
    pyodide.runPython(`_paused = True; _stepping = True; _stopped = False`);
  } else {
    paused = false;
    stepping = false;
    pyodide.runPython(`_paused = False; _stepping = False; _stopped = False`);
  }

  if (codeContext === 'system') {
    // system code runs without tracing
    try {
      const result = await pyodide.runPythonAsync(code);
      const stdout = pyodide.globals.get('_rt_stdout')._hist.toJs();
      const stderr = pyodide.globals.get('_rt_stderr')._hist.toJs();
      self.postMessage({ type: "execution_complete", taskId: currentTaskId, codeId, error: null, result: result != null ? String(result) : null, stdout, stderr });
    } catch (err) {
      self.postMessage({ type: "execution_error", taskId: currentTaskId, codeId, error: err.message });
    }
    return;
  }

  // clear stdout/stderr history for this run
  pyodide.runPython('_rt_stdout.clear_history(); _rt_stderr.clear_history()');

  // user code: run with tracing
  executing = true;
  const startTime = Date.now();
  let execError = null;
  let dillBytes = null;

  try {
    const runId = Date.now();
    pyodide.globals.set('_user_code_str', code);
    pyodide.globals.set('_run_id', runId);

    // enable tracing and execute
    await pyodide.runPythonAsync(`
_sys.settrace(_trace_function)
try:
    _new_locals = _exec_wrapper(_user_code_str, _run_id)
    # merge new locals into globals for persistent state
    for _k, _v in _new_locals.items():
        if not _k.startswith('_'):
            globals()[_k] = _v
            _user_vars[_k] = _k
finally:
    _sys.settrace(None)
`);

    // dill dump of user vars for editor completions
    try {
      await pyodide.runPythonAsync(`
_dill_ns = {_k: globals()[_k] for _k in _user_vars if _k in globals()}
_dill_bytes = _dill.dumps(_dill_ns)
`);
      const pyBytes = pyodide.globals.get('_dill_bytes');
      dillBytes = pyBytes.toJs();
    } catch (e) {
      // dill serialization is best-effort
    }

  } catch (err) {
    const msg = err.message || String(err);
    // KeyboardInterrupt from stop is not an error
    if (msg.includes('Execution stopped by user')) {
      executing = false;
      self.postMessage({ type: "execution_stopped", taskId: currentTaskId, codeId });
      return;
    }
    execError = msg;
  }

  executing = false;
  const elapsed = Date.now() - startTime;

  // build final variable summary
  let variableSummary = {};
  try {
    const json = pyodide.runPython(`
_final = {}
_exp = globals().get('_expanded_variables', set())
for _k in _user_vars:
    if _k in globals() and not _k.startswith('_'):
        _final.update(_summarise_variable(globals()[_k], _k, _exp))
_json.dumps(_final)
`);
    variableSummary = JSON.parse(json);
  } catch (e) {
    // best-effort
  }

  // collect stdout/stderr history
  let stdoutHist = [];
  let stderrHist = [];
  try {
    stdoutHist = pyodide.globals.get('_rt_stdout')._hist.toJs();
    stderrHist = pyodide.globals.get('_rt_stderr')._hist.toJs();
  } catch (e) { /* best-effort */ }

  self.postMessage({
    type: "execution_complete",
    taskId: currentTaskId,
    codeId,
    error: execError,
    variables: variableSummary,
    dill: dillBytes,
    executionTime: elapsed,
    stdout: stdoutHist,
    stderr: stderrHist,
  });
};

const handleFlowControl = (action, newSpeed) => {
  if (!initialized) return;

  if (action === 'pause') {
    paused = true;
    pyodide.runPython('_paused = True; _stepping = False');
    self.postMessage({ type: "flow", taskId: currentTaskId, state: "paused" });
  } else if (action === 'resume') {
    paused = false;
    stepping = false;
    pyodide.runPython('_paused = False; _stepping = False');
    self.postMessage({ type: "flow", taskId: currentTaskId, state: "running" });
  } else if (action === 'step') {
    stepping = true;
    paused = true;
    pyodide.runPython('_paused = True; _stepping = True');
    self.postMessage({ type: "flow", taskId: currentTaskId, state: "stepping" });
  } else if (action === 'stop') {
    stopped = true;
    paused = false;
    pyodide.runPython('_stopped = True; _paused = False');
    self.postMessage({ type: "flow", taskId: currentTaskId, state: "stopped" });
  } else if (action === 'speed' && typeof newSpeed === 'number') {
    pyodide.runPython(`_sleep_time = ${newSpeed}`);
  }
};

const handleExpandCollapse = (path, action) => {
  if (!initialized) {
    self.postMessage({ type: "error", taskId: currentTaskId, text: "Worker not initialized for expand/collapse" });
    return;
  }
  pyodide.globals.set('_single_expand_path', path);
  pyodide.globals.set('_is_expand', action === 'expand');
  pyodide.runPythonAsync(`
_target_frame, _target_var = _single_expand_path.split('|')
_var_parts = _target_var.split('.')
_var_info  = None

_frame = None
for f in _frame_stack:
    if f.f_code.co_name == _target_frame:
        _frame = f
        break

if _is_expand:
    _expanded_variables.add(_single_expand_path)
else:
    _expanded_variables.discard(_single_expand_path)
_frame_expanded = {k.split('|')[1] for k in _expanded_variables if k.startswith(_target_frame + '|')}

if _frame is not None:
    _frame_info = _summarize_frame(_frame.f_locals, _frame_expanded)
else:
    _frame_info = {}

_json.dumps({"frameSummary":_frame_info, "expanded_variables": list(_expanded_variables), "frame_expanded": list(_frame_expanded), "target_frame": _target_frame, "target_var": _target_var})

    `).then((result) => {
    self.postMessage({ type: "variableinfo", taskId: currentTaskId, ...JSON.parse(result) });
  });
};

self.onmessage = async (event) => {
  const { type, code, taskId, codeId, codeContext, flowAction, newSpeed, path, action } = event.data;
  // allow lock/unlock even before init
  if (type === "lock") {
    currentTaskId = taskId;
    return;
  }
  if (type === "unlock") {
    currentTaskId = null;
    resetPyodideContext();
    return;
  }

  if (!initialized) {
    self.postMessage({ type: "error", taskId: currentTaskId, text: "Worker not initialized yet" });
    return;
  }
  if (taskId && currentTaskId && currentTaskId !== taskId) {
    self.postMessage({ type: "error", taskId: currentTaskId, text: `Worker locked to ${currentTaskId}, rejected ${taskId}` });
    return;
  }

  if (type === "execute") {
    handleExecuteRequest(code, codeId, codeContext, event.data.startPaused || false);
  } else if (type === "flow_control") {
    handleFlowControl(flowAction, newSpeed);
  } else if (type === "expand" || type === "collapse") {
    handleExpandCollapse(path, type);
  } else if (type === "reset") {
    resetPyodideContext();
    self.postMessage({ type: "flow", taskId: currentTaskId, state: "reset" });
  } else {
    self.postMessage({ type: "error", taskId: currentTaskId, text: `kernel unhandled message type: ${type}` });
  }
};

init();
