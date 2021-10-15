importScripts('/lib/babel.js');

const transformImport = ({types}) => {
    return {
        name: 'import-transform',
        visitor: {
            ImportDeclaration(path) {
                const sourcePath = path.get('source');
                const source = sourcePath.node.value;
                const hasExtension = source.endsWith('.js') || source.endsWith('.jsx');
                const isLibrary = !(source.startsWith('/') || source.startsWith('./') || source.startsWith('../'))
                let replacement = source;
                if (isLibrary) {
                    replacement = `/lib/${source}`;
                }
                if (!hasExtension) {
                    replacement += isLibrary ? '.js' : '.jsx';
                }
                if (source !== replacement) {
                    sourcePath.replaceWith(types.stringLiteral(replacement));
                }
            }
        }
    }
}

self.addEventListener('fetch', (event) => {
    const { request: { url } } = event;
    if (url.endsWith('.jsx')) {
        event.respondWith(
            fetch(url)
                .then((r) => r.text())
                .then((body) => Babel.transform(body, {
                    presets: [
                        ['react'],
                        ['env', { modules: false }]
                    ],
                    plugins: [
                        transformImport
                    ],
                    sourceMaps: true,
                }))
                // .then((t) => {
                //     console.log(t.code);
                //     return t;
                // })
                .then((transformed) => new Response(
                    transformed.code,
                    {
                        headers: new Headers({
                            'Content-Type': 'application/javascript'
                        })
                    }
                ))
        );
    }
});

self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));