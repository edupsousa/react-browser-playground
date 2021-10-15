const libraries = {
  react: '/lib/react.development.js',
  'react-dom': '/lib/react-dom.js',
};

self.parseImportPlugin = ({ types }) => {
  return {
    name: 'parse-import-plugin',
    visitor: {
      ImportDeclaration(path) {
        const sourcePath = path.get('source');
        const source = sourcePath.node.value;
        let replacement = parseImport(source);
        if (source !== replacement) {
          sourcePath.replaceWith(types.stringLiteral(replacement));
        }
      },
    },
  };
};

function parseImport(source) {
  let replacement = source;
  if (libraries[source] !== undefined) {
    replacement = libraries[source];
  } else {
    const hasExtension = source.endsWith('.js') || source.endsWith('.jsx');
    const isLibrary = !(
      source.startsWith('/') ||
      source.startsWith('./') ||
      source.startsWith('../')
    );
    if (isLibrary) {
      replacement = `/lib/${source}`;
    }
    if (!hasExtension) {
      replacement += isLibrary ? '.js' : '.jsx';
    }
  }
  return replacement;
}
