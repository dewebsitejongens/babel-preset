/*
 * Copyright (c) 2021 De Website Jongens. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/* eslint-disable react/forbid-foreign-prop-types */

const { path } = require('path');
const { declare } = require('@babel/helper-plugin-utils');

/**
 * Declare module, based on the airbnb babel preset.
 *
 * @see https://github.com/airbnb/babel-preset-airbnb/blob/master/index.js
 */
module.exports = declare((api, options) => {
  // See docs about api at https://babeljs.io/docs/en/config-files#apicache
  api.assertVersion('^7.0.0');

  // Get the environment.
  const env = process.env.NODE_ENV || 'production';

  const {
    modules = 'auto',
    runtimeVersion,
    transformRuntime = true,
    looseClasses = true,
    removePropTypes = false,
  } = options;

  // Make sure something is selected.
  if (typeof modules !== 'boolean' && modules !== 'auto') {
    throw new TypeError('@dewebsitejongens/babel-preset only accepts `false`, or `"auto"` as the value of the "modules" option');
  }

  // Get debug variable.
  const debug = typeof options.debug === 'boolean' ? options.debug : false;

  // Get development variable.
  const development = typeof options.development === 'boolean' ? options.development : api.cache.using(
    () => process.env.NODE_ENV === 'development',
  );

  /**
   * Babel presets.
   */
  function presets() {
    const opts = {
      debug,
      shippedProposals: true,
      loose: looseClasses,
      modules: modules === false ? false : 'auto',
      exclude: [
        'transform-async-to-generator',
        'transform-template-literals',
        'transform-regenerator',
        'transform-typeof-symbol',
      ],
      useBuiltIns: false,
    };

    // Target based on environment.
    if (env === 'test') {
      opts.targets = {
        node: 'current',
      };
    } else {
      opts.modules = false;
      opts.targets = {
        browsers: require('@dewebsitejongens/browserslist-config'),
      };
    }

    return [
      [
        require.resolve('@babel/preset-env'),
        opts,
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          development,
          runtime: 'automatic',
        },
      ],
      [
        require.resolve('@babel/preset-typescript'),
        {
          allowNamespaces: true,
          allowDeclareFields: true,
        },
      ],
    ];
  }

  /**
   * Babel plugins.
   */
  function plugins() {
    const items = [];

    // Proposals.
    items.push(
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      require.resolve('@babel/plugin-proposal-async-generator-functions'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      [
        require.resolve('@babel/plugin-proposal-pipeline-operator'),
        {
          proposal: 'minimal',
        },
      ],
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
    );

    // Transformers.
    items.push(
      looseClasses && [
        require.resolve('@babel/plugin-transform-classes'),
        {
          loose: true,
        },
      ],
      [
        require.resolve('@babel/plugin-transform-template-literals'),
        {
          spec: true,
        },
      ],
      require.resolve('@babel/plugin-transform-property-mutators'),
      require.resolve('@babel/plugin-transform-member-expression-literals'),
      require.resolve('@babel/plugin-transform-property-literals'),
      require.resolve('babel-plugin-object-to-json-parse'),
      require.resolve('babel-plugin-minify-dead-code-elimination'),
      [
        require.resolve('@babel/plugin-transform-destructuring'),
        {
          loose: true,
          useBuiltIns: false,
        },
      ],
      [
        require.resolve('@babel/plugin-transform-spread'),
        {
          loose: true,
        },
      ],
      removePropTypes && [
        require.resolve('babel-plugin-transform-react-remove-prop-types'),
        {
          mode: 'wrap',
          ignoreFilenames: [
            'node_modules',
          ],
        },
      ],
      transformRuntime && [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          absoluteRuntime: false,
          corejs: false,
          helpers: false,
          regenerator: false,
          version: runtimeVersion,
        },
      ],
    );

    return items.filter(Boolean);
  }

  return {
    sourceType: 'module',
    presets: presets(),
    plugins: plugins(),
  };
});
