// python editor worker
// takes care of semantic tokens and completions for monaco editor

importScripts("https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js");

let pyodide = null;
let initialized = false;

const typeIdx = {
	module:    0,
	class:     1,
	function:  2,
	param:     3,
	instance:  4,
	statement: 4,
	property:  5,
};

const INIT_PYTHON_SCRIPT = `
import jedi as _jedi, json as _json, dill as _dill

`

const SEMANTIC_SCRIPT = `
def get_semantic_tokens(src):
		_toks = []
		try:
				_scr = _jedi.Script(src)
				for _n in _scr.get_names(all_scopes=True, definitions=True, references=True):
						_t = _n.type
						if _t == 'keyword':
								continue
						_toks.append((_n.line, _n.column, len(_n.name), _t, _n.is_definition()))
				_toks.sort()
		except Exception:
				pass
		return _json.dumps(_toks)
`

const COMPLETION_SCRIPT = `
_namespace = {}

def _import_locals(pickled_bytes):
    global _namespace
    _namespace = _dill.loads(bytes(pickled_bytes))

def _get_completions(src, line, col):
    try:
        completions = _jedi.Interpreter(src, namespaces=[_namespace]).complete(line, col)
        return _json.dumps([
            {"label": c.name, "type": c.type, "signature": str(c.get_signatures() or "")}
            for c in completions[:50]
            if not c.name.startswith("_")
        ])
    except Exception:
        return "[]"
`

const PIP_INSTALL_DILL = `
import micropip as _mp
await _mp.install("dill")
`

async function init() {
  try {
    pyodide = await loadPyodide();
    pyodide.setStdout({
      batched: (text) => self.postMessage({ type: "stdout", text }),
    });
    pyodide.setStderr({
      batched: (text) => self.postMessage({ type: "stderr", text }),
		});
		await pyodide.loadPackage(['jedi', 'micropip']);
		await pyodide.runPythonAsync(PIP_INSTALL_DILL);
		await pyodide.runPythonAsync(INIT_PYTHON_SCRIPT);
		await pyodide.runPythonAsync(SEMANTIC_SCRIPT);
		await pyodide.runPythonAsync(COMPLETION_SCRIPT);
    initialized = true;
    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({ type: "error", text: `Init failed: ${err.message}` });
  }
}

self.onmessage = async (event) => {
	const { type, code, taskId, line, col, locals } = event.data;

	if (type == 'semantic') {
		handleSemanticRequest(code, taskId);
	} else if (type == 'completion') {
		handleCompletionRequest(code, line, col, taskId, locals ?? null);
	}
};

const unlockSelf = async () => {
	// sends message to pool manager to release lock (set status to 'idle')
	// locks are set in pool manager before requests
	// allocated workers are permanently locked and process items in order, so they remain locked

	self.postMessage({ type: 'unlock' });
}

const handleSemanticRequest = async (code, taskId) => {
	if (!initialized) {
		self.postMessage({ type: "error", text: "Worker not initialized for Highlighting" });
		return;
	}
	try {
		pyodide.globals.set("_sem_src", code);
		const json = await pyodide.runPythonAsync(`
get_semantic_tokens(_sem_src)
	`);
		const tokens = JSON.parse(json);

		const data = [];
		let prevLine = 0;
		let prevCol = 0;

		for (const [line1, col, len, typ, isDef] of tokens) {
			const line = line1 - 1; // Jedi 1-based → Monaco 0-based
			const ti = typeIdx[typ];
			if (ti === undefined) continue;

			const dl = line - prevLine;
			const dc = dl === 0 ? col - prevCol : col;
			const mod = isDef ? 0b10 : 0; // bit 1 = 'definition'

			data.push(dl, dc, len, ti, mod);
			prevLine = line;
			prevCol = col;
		}

		self.postMessage({type:"semantics", taskId, semantics:{ data: new Uint32Array(data), resultId: undefined }});
	} catch (err) {
		self.postMessage({type: "error", text: `Semantic request failed: ${err.message}`, taskId});
	} 
	
}

const handleCompletionRequest = async (code, line, col, taskId, locals) => {
	if (!initialized) {
		self.postMessage({ type: "error", text: "Worker not initialized for Completions", taskId });
		return;
	}
	try {
		if (locals) {
			pyodide.globals.set("_comp_locals", locals);
			await pyodide.runPythonAsync("_import_locals(_comp_locals.to_py())");
		}
		pyodide.globals.set("_comp_src", code);
		pyodide.globals.set("_comp_line", line);
		pyodide.globals.set("_comp_col", col);
		const json = await pyodide.runPythonAsync("_get_completions(_comp_src, _comp_line, _comp_col)");
		const completions = JSON.parse(json);
		self.postMessage({ type: "completion", taskId, completions });
	} catch (err) {
		self.postMessage({ type: "error", text: `Completion request failed: ${err.message}`, taskId });
	}
}

init();
