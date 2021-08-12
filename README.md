# @dewebsitejongens/babel-preset

## Installation

Install the module

```bash
yarn add browserslist @babel/core @babel/runtime @dewebsitejongens/babel-preset --dev
```

## Usage
to use the babel preset put the code below in the `.babelrc` file. Keep in mind replace the `x.xx.x` with the installed `@babel/runtime` version.

```json
{
  "presets": [
    [
      "@dewebsitejongens/babel-preset",
      {
        "runtimeVersion": "x.xx.x"
      }
    ]
  ]
}

```

## Options

Here are the options you can set in your `.babelrc`:

* **modules**: {boolean, default 'auto'}: Not recommended to change, check babel-preset-env modules.
* **runtimeVersion**: {string}: The @babel/runtime installed version.
* **transformRuntime** {boolean, default: true}: A plugin that enables the re-use of Babel's injected helper code to save on codesize.
* **looseClasses** {boolean, default: true}: Enable "loose" transformations for any plugins in this preset that allow them.
* **removePropTypes** {boolean, default: false}: Remove prop-types from bundled file.
