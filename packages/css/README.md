# CSS definitions of the web platform

This package contains CSS property definitions scraped from the latest versions of web platform specifications in [webref](https://github.com/w3c/webref), with fixes applied to ensure all CSS value definitions can be parsed with [CSSTree](https://github.com/csstree/csstree).

# API

The async `listAll()` method resolves with an object where the keys are spec shortnames, and the values are objects with an async `json()` method to get the contents of the file as a JSON object. Example:

```js
const css = require('@webref/css');

const files = await css.listAll();
for (const [shortname, file] of Object.entries(files)) {
  const json = await file.json();
  // do something with json object
}
```

As a shorthand, the async `parseAll()` method resolves with an object where the keys are spec shortnames and the values are the result of parsing the CSS files as JSON. Example:

```js
const css = require('@webref/css');

const parsedFiles = await css.parseAll();
for (const [shortname, json] of Object.entries(parsedFiles)) {
  // do something with the json object
}
```

CSS fragments that appear in the JSON objects, in other words the contents of the `properties[].value`, `properties[].newValue`, `descriptors[].value` and `valuespaces[].value` properties can be parsed with the [CSSTree Value Definition Syntax parser](https://github.com/csstree/csstree/blob/master/docs/definition-syntax.md#value-definition-syntax). Example:

```js
const css = require('@webref/css');
const { definitionSyntax } = require('css-tree');

const parsedFiles = await css.parseAll();
for (const [shortname, json] of Object.entries(parsedFiles)) {
  if (json.properties) {
    for (const [name, desc] of json.properties) {
      if (desc.value) {
        const ast = definitionSyntax.parse(desc.value);
        // do something with the ast
      }
    }
  }
}
```


# Guarantees

The following guarantees are provided by this package:
- All CSS files can be parsed by the version of [CSSTree](https://github.com/csstree/csstree) used in `peerDependencies` in `package.json`.