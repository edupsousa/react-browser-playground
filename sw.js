/// <reference lib="webworker" />

(() => {
  importScripts('/lib/babel.js');
  importScripts('/lib/index.js');
  const parseImportPlugin = self.parseImportPlugin;

  const worker = /** @type {ServiceWorkerGlobalScope} */ (
    /** @type {unknown} */ (globalThis.self)
  );

  worker.addEventListener('install', (event) => {
    return worker.skipWaiting();
  });
  worker.addEventListener('activate', (event) => {});
  worker.addEventListener('fetch', (event) => onFetch(event));

  function onFetch(event) {
    const {
      request: { url },
    } = event;
    if (url.endsWith('.jsx')) {
      event.respondWith(fetchJSX(url));
    }
  }

  function fetchJSX(url) {
    return fetch(url)
      .then((r) => r.text())
      .then((code) => babelTransformJSX(code, url))
      .then((code) => createJSResponse(code));
  }

  function createJSResponse(code) {
    return new Response(code, {
      headers: new Headers({
        'Content-Type': 'application/javascript',
      }),
    });
  }

  function babelTransformJSX(code, url) {
    return Babel.transform(code, {
      presets: [['react'], ['env', { modules: false }]],
      plugins: [parseImportPlugin],
      sourceMaps: 'inline',
      sourceFileName: url,
    }).code;
  }
})();
