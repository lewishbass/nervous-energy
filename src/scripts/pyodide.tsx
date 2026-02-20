
// Pyodide loader hook
// - Singleton: only one Pyodide instance is ever created per session
// - Cached: stores version in localStorage, browser HTTP cache handles the rest
// - Only reloads from CDN if PYODIDE_VERSION changes

import { useState, useEffect } from 'react';

import type { Monaco } from '@monaco-editor/react';
import type { editor, Position, languages } from 'monaco-editor';

const PYODIDE_VERSION = '0.25.1';
const CDN_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;

// Module-level singleton so Pyodide survives React re-renders / strict mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodideInstance: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodideLoadPromise: Promise<any> | null = null;

async function loadPyodideInstance() {
	if (pyodideInstance) {
		console.log('[Pyodide] Already initialized, returning cached instance');
		return pyodideInstance;
	}
	if (pyodideLoadPromise) {
		console.log('[Pyodide] Load already in progress, awaiting existing promise');
		return pyodideLoadPromise;
	}

	pyodideLoadPromise = (async () => {
		// Check if we need to bust the browser cache (version changed)
		const cachedVersion = localStorage.getItem('pyodide-version');
		const versionChanged = cachedVersion !== null && cachedVersion !== PYODIDE_VERSION;
		console.log(`[Pyodide] Cached version: ${cachedVersion}, current: ${PYODIDE_VERSION}, changed: ${versionChanged}`);

		// Inject the Pyodide loader script if it hasn't been loaded yet
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (!(window as any).loadPyodide) {
			// Remove any stale Pyodide script tags if version changed
			if (versionChanged) {
				console.log('[Pyodide] Version changed — removing stale script tags');
				document.querySelectorAll('script[data-pyodide]').forEach((s) => s.remove());
			}

			const script = document.createElement('script');
			script.src = `${CDN_URL}/pyodide.js`;
			script.crossOrigin = 'anonymous';
			script.setAttribute('data-pyodide', PYODIDE_VERSION);

			console.log(`[Pyodide] Injecting loader script: ${script.src}`);
			await new Promise<void>((resolve, reject) => {
				script.onload = () => resolve();
				script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN'));
				document.head.appendChild(script);
			});
			console.log('[Pyodide] Loader script injected and executed successfully');
		} else {
			console.log('[Pyodide] window.loadPyodide already present, skipping script injection');
		}

		console.log('[Pyodide] Calling window.loadPyodide()…');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const pyodide = await (window as any).loadPyodide({
			indexURL: `${CDN_URL}/`,
		});
		console.log('[Pyodide] Core runtime loaded');

		// preload micropip
		console.log('[Pyodide] Pre-loading micropip…');
		await pyodide.loadPackage('micropip');

		console.log('[Pyodide] micropip loaded, installing jedi');
		await pyodide.loadPackage('jedi');

		// Pre-load useful stdlib modules
		//console.log('[Pyodide] Pre-loading stdlib modules (rlcompleter, json)…');
		//await pyodide.runPythonAsync('import rlcompleter, json');
		//console.log('[Pyodide] Stdlib modules loaded');

    pyodideInstance = pyodide;
    
    // Init user variables dict for persistence across runs
    resetPyodideContext();

    // Set up async execution helpers (AST sleep transformer + realtime stdout)
    pyodideInstance.runPython(`
import ast as _ast

class _SleepTransformer(_ast.NodeTransformer):
    """Transforms time.sleep(x) into await asyncio.sleep(x) for non-blocking execution.
    Only transforms calls in async-valid contexts (top-level or inside async def)."""
    def __init__(self):
        self.needs_asyncio = False
        self._sleep_names = set()
        self._time_aliases = {'time'}
        self._async_ctx = True  # top-level code is wrapped in async def

    def visit_Import(self, node):
        for alias in node.names:
            if alias.name == 'time':
                self._time_aliases.add(alias.asname or alias.name)
        return node

    def visit_ImportFrom(self, node):
        if node.module == 'time':
            for alias in node.names:
                if alias.name == 'sleep':
                    self._sleep_names.add(alias.asname or alias.name)
        return node

    def visit_FunctionDef(self, node):
        saved = self._async_ctx
        self._async_ctx = False
        self.generic_visit(node)
        self._async_ctx = saved
        return node

    def visit_AsyncFunctionDef(self, node):
        saved = self._async_ctx
        self._async_ctx = True
        self.generic_visit(node)
        self._async_ctx = saved
        return node

    def visit_Call(self, node):
        self.generic_visit(node)
        if not self._async_ctx:
            return node
        _is_time_sleep = (
            isinstance(node.func, _ast.Attribute)
            and isinstance(node.func.value, _ast.Name)
            and node.func.value.id in self._time_aliases
            and node.func.attr == 'sleep'
        )
        _is_bare_sleep = (
            isinstance(node.func, _ast.Name)
            and node.func.id in self._sleep_names
        )
        if _is_time_sleep or _is_bare_sleep:
            self.needs_asyncio = True
            new_call = _ast.Call(
                func=_ast.Attribute(
                    value=_ast.Name(id='asyncio', ctx=_ast.Load()),
                    attr='sleep', ctx=_ast.Load()
                ),
                args=node.args, keywords=node.keywords
            )
            return _ast.Await(value=new_call)
        return node

def _transform_sleeps(code):
    """Transform time.sleep() calls to await asyncio.sleep() for non-blocking execution."""
    try:
        tree = _ast.parse(code)
        t = _SleepTransformer()
        tree = t.visit(tree)
        _ast.fix_missing_locations(tree)
        result = _ast.unparse(tree)
        if t.needs_asyncio and 'import asyncio' not in code:
            result = 'import asyncio\\n' + result
        return result
    except SyntaxError:
        return code

class _RTOut:
    """Realtime stdout/stderr redirect that calls a JS callback per line."""
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
`);
    console.log('[Pyodide] Async execution helpers installed');

		// Persist loaded version for cache-busting on future visits
		try {
			localStorage.setItem('pyodide-version', PYODIDE_VERSION);
			console.log('[Pyodide] Version persisted to localStorage');
		} catch {
			console.warn('[Pyodide] Could not persist version — localStorage unavailable');
		}

		console.log('[Pyodide] Initialization complete ✓');
		return pyodide;
	})();

	try {
		return await pyodideLoadPromise;
	} catch (e) {
		// Allow retry on failure
		console.error('[Pyodide] Load failed, clearing promise so next call retries', e);
		pyodideLoadPromise = null;
		throw e;
	}
}

function usePyodide() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [pyodide, setPyodide] = useState<any>(pyodideInstance);
	const [loading, setLoading] = useState(!pyodideInstance);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Already loaded from a previous mount
		if (pyodideInstance) {
			console.log('[usePyodide] Instance already available on mount');
			setPyodide(pyodideInstance);
			setLoading(false);
			return;
		}

		let cancelled = false;

		console.log('[usePyodide] Starting Pyodide load…');
		loadPyodideInstance()
			.then((instance) => {
				if (!cancelled) {
					console.log('[usePyodide] Load succeeded, updating state');
					setPyodide(instance);
					setLoading(false);
				} else {
					console.log('[usePyodide] Load succeeded but effect was cancelled (unmount)');
				}
			})
			.catch((e) => {
				if (!cancelled) {
					console.error('[usePyodide] Load failed:', e?.message);
					setError(e?.message ?? 'Failed to load Pyodide');
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return { pyodide, loading, error };
}

function resetPyodideContext() {
  // all user-defined variables are stored in a dict that can be cleared to reset interpreter state without reloading the entire Pyodide instance
  if (pyodideInstance) {
    pyodideInstance.runPython(`
      if('_user_vars' in globals()):
          for k, v in _user_vars.items():
              if k in globals():
                  del globals()[k]
      _user_vars = {}
      _run_history = []
    `);
    console.log('[Pyodide] Context reset: user variables cleared');
  } else {
    console.warn('[Pyodide] Cannot reset context: instance not loaded');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _completionLock = false;

const registerPyodideCompletions = (
  monacoInstance: Monaco,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pyodide: any,
) => {
  const disposable = monacoInstance.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.'],

    provideCompletionItems: async (model: editor.ITextModel, position: Position) => {
      if (!pyodide || _completionLock) return { suggestions: [] };

      const code = model.getValue();
      const line = position.lineNumber;
      const col  = position.column - 1; // Monaco 1-based → Jedi 0-based

      _completionLock = true;
      try {
        // Pass data via Pyodide globals to avoid all string-escaping issues
        pyodide.globals.set('_jedi_src',  code);
        pyodide.globals.set('_jedi_line', line);
        pyodide.globals.set('_jedi_col',  col);

        const completionsJson: string = await pyodide.runPythonAsync(`
import jedi, json as _json

_result = '[]'

past_code = '\\n'.join(_run_history) + ('\\n' if _run_history else '')
complete_line = _jedi_line + past_code.count('\\n')  # adjust line number for past code
try:
    _script = jedi.Script(past_code + _jedi_src)
    _comps  = _script.complete(complete_line, _jedi_col)
    _result = _json.dumps([
        {'label': c.name, 'kind': c.type, 'detail': c.description}
        for c in _comps[:50]
    ])
except Exception:
    pass
_result
`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completions: { label: string; kind: string; detail: string }[] =
          JSON.parse(completionsJson);

        const CIK = monacoInstance.languages.CompletionItemKind;
        const kindMap: Record<string, typeof CIK[keyof typeof CIK]> = {
          module:    CIK.Module,
          class:     CIK.Class,
          function:  CIK.Function,
          param:     CIK.Variable,
          instance:  CIK.Variable,
          keyword:   CIK.Keyword,
          statement: CIK.Keyword,
          property:  CIK.Property,
          path:      CIK.File,
        };

        const word = model.getWordUntilPosition(position);

				// don't return suggestions with dunders
				const suggestions = completions.filter(c => !c.label.startsWith('__') || !c.label.endsWith('__')).map((c) => ({
          label: c.label,
          kind: kindMap[c.kind] ?? CIK.Text,
          detail: c.detail,
          insertText: c.label,
          range: {
            startLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
				}));



        return { suggestions };
      } catch (error) {
        console.error('[Jedi] Completion error:', error);
        return { suggestions: [] };
      } finally {
        _completionLock = false;
      }
    },
  });

  return disposable;
};


// ---------- Semantic tokens via Jedi get_names ----------

let _semanticLock = false;

const registerPyodideSemanticTokens = (
  monacoInstance: Monaco,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pyodide: any,
) => {
  const tokenTypes = [
    'namespace',  // 0 — module
    'type',       // 1 — class
    'function',   // 2 — function
    'parameter',  // 3 — param
    'variable',   // 4 — instance / statement
    'property',   // 5 — property
    'decorator',  // 6 — decorator
  ];
  const tokenModifiers = ['declaration', 'definition', 'defaultLibrary'];

  const legend: languages.SemanticTokensLegend = { tokenTypes, tokenModifiers };

  const typeIdx: Record<string, number> = {
    module:   0,
    class:    1,
    function: 2,
    param:    3,
    instance: 4,
    statement:4,
    property: 5,
  };

  const disposable = monacoInstance.languages.registerDocumentSemanticTokensProvider('python', {
    getLegend: () => legend,

    provideDocumentSemanticTokens: async (model: editor.ITextModel) => {
      if (!pyodide || _semanticLock) return null;

      const code = model.getValue();
      if (!code.trim()) return null;

      _semanticLock = true;
      try {
        pyodide.globals.set('_sem_src', code);

        const json: string = await pyodide.runPythonAsync(`
import jedi, json as _json

_toks = []
try:
    _scr = jedi.Script(_sem_src)
    for _n in _scr.get_names(all_scopes=True, definitions=True, references=True):
        _t = _n.type
        if _t == 'keyword':
            continue
        _toks.append((_n.line, _n.column, len(_n.name), _t, _n.is_definition()))
    _toks.sort()
except Exception:
    pass
_json.dumps(_toks)
`);

        const tokens: [number, number, number, string, boolean][] = JSON.parse(json);

        const data: number[] = [];
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

        return { data: new Uint32Array(data), resultId: undefined };
      } catch (err) {
        console.error('[Jedi] Semantic tokens error:', err);
        return null;
      } finally {
        _semanticLock = false;
      }
    },

    releaseDocumentSemanticTokens: () => {},
  });

  return disposable;
};


// ---------- Custom Monaco themes with semantic token colors ----------

const definePythonThemes = (monacoInstance: Monaco) => {
	monacoInstance.editor.defineTheme('python-dark', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			// Semantic token types — VS Code Dark+ palette
			{ token: 'namespace', foreground: '4EC9B0' },
			{ token: 'type',      foreground: '4EC9B0' },
			{ token: 'function',  foreground: 'DCDCAA' },
			{ token: 'parameter', foreground: '6F99EC' },
			{ token: 'variable',  foreground: '9CDCFE' },
			{ token: 'property',  foreground: 'B8EAFF' },
			{ token: 'decorator', foreground: 'C586C0' },
		],
		colors: {},
		});

  monacoInstance.editor.defineTheme('python-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'namespace', foreground: '267F99' },
      { token: 'type',      foreground: '267F99' },
      { token: 'function',  foreground: '795E26' },
      { token: 'parameter', foreground: '001060' },
      { token: 'variable',  foreground: '0020A0' },
      { token: 'property',  foreground: '1050C0' },
      { token: 'decorator', foreground: '795E26' },

    ],
    colors: {},
  });
};

// ---------- More Variable Info ----------

const getVariableInfo = async (
  pyodide: any,
  var_path: Array<string>, // robot.pos.x -> ['robot', 'pos', 'x']
) => {
  if (!pyodide) return {};
  pyodide.globals.set('_var_path', var_path);

  const infoJson: string = await pyodide.runPythonAsync(`
import json as _json

_var_info = {}

_var_ = globals().get(_var_path[0], None)
for attr in _var_path[1:]:
  if _var_ is None:
    break
  _var_ = getattr(_var_, attr, None)

if _var_ is None:
  _var_info = {}
else:
  _var_info = {}
  for _n in sorted(dir(_var_)):
    if _n.startswith('_'):
        continue
    try:
        _v = getattr(_var_, _n)
        _repr = repr(_v)
        if len(_repr) > 100:
            _repr = _repr[:100] + '...'
    except Exception:
        continue
        
    _var_info[_n] = {'name': _n, 'type': type(_v).__name__, 'value': _repr, 'callable': callable(_v)}
_json.dumps(_var_info)`);
  
  const parsedInfo = JSON.parse(infoJson);
  //console.log(`[Pyodide] Variable info for ${var_path.join('.')} :`, parsedInfo);
  return parsedInfo;
}

const installPackage = async (pyodide: any, packageName: string, printCallback: (msg: string) => void) => {

}
  

export { usePyodide, registerPyodideCompletions, registerPyodideSemanticTokens, definePythonThemes, resetPyodideContext, getVariableInfo };