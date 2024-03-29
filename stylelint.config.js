const config = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-order'],
  rules: {
    'at-rule-no-unknown': null,
    'at-rule-empty-line-before': null,
    'color-no-hex': true,
    'function-name-case': null,
    // https://github.com/stylelint/stylelint/issues/3037
    // https://github.com/stylelint/stylelint/issues/2643
    'length-zero-no-unit': null,
    'selector-list-comma-newline-after': 'always-multi-line',
    'selector-list-comma-space-after': 'always-single-line',
    'no-descending-specificity': null,
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        'rules',
        {
          type: 'at-rule',
          name: 'media',
        },
      ],
      { unspecified: 'bottom' },
    ],
    'order/properties-order': [
      [
        'composes',
        'display',
        {
          order: 'flexible',
          properties: [
            'flex',
            'flex-basis',
            'flex-direction',
            'flex-shrink',
            'flex-flow',
            'flex-grow',
            'flex-wrap',
            'order',
            'justify-content',
            'align-items',
            'align-content',
            'align-self',
          ],
        },
        'justify',
        'align',
        {
          order: 'flexible',
          properties: [
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
          ],
        },
        {
          order: 'flexible',
          properties: [
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
          ],
        },
        'height',
        'min-height',
        'max-height',
        'width',
        'min-width',
        'max-width',
        'position',
        'float',
        'top',
        'right',
        'bottom',
        'left',
        'vertical-align',
        'z-index',
        {
          order: 'flexible',
          properties: ['overflow', 'overflow-x', 'overflow-y'],
        },
        {
          order: 'flexible',
          properties: [
            'border',
            'border-color',
            'border-width',
            'border-radius',
            'border-style',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'border-top-right',
            'border-top-left',
            'border-bottom-right',
            'border-bottom-left',
            'border-top-color',
            'border-right-color',
            'border-bottom-color',
            'border-left-color',
            'border-top-right-color',
            'border-top-left-color',
            'border-bottom-right-color',
            'border-bottom-left-color',
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width',
            'border-top-right-width',
            'border-top-left-width',
            'border-bottom-right-width',
            'border-bottom-left-width',
            'border-top-radius',
            'border-right-radius',
            'border-bottom-radius',
            'border-left-radius',
            'border-top-right-radius',
            'border-top-left-radius',
            'border-bottom-right-radius',
            'border-bottom-left-radius',
            'border-top-style',
            'border-right-style',
            'border-bottom-style',
            'border-left-style',
            'border-top-right-style',
            'border-top-left-style',
            'border-bottom-right-style',
            'border-bottom-left-style',
          ],
        },
        {
          order: 'flexible',
          properties: [
            'background',
            'background-size',
            'background-color',
            'background-image',
          ],
        },
        {
          properties: [
            'font-family',
            'font-size',
            'font-weight',
            'font-style',
            'font-smoothing',
          ],
        },
        {
          order: 'flexible',
          properties: [
            'text-align',
            'text-decoration',
            'text-overflow',
            'text-transform',
          ],
        },
        'line-height',
        {
          order: 'flexible',
          properties: ['word-wrap', 'word-break'],
        },
        'white-space',
        'color',
      ],
      { unspecified: 'bottom' },
    ],
  },
};

module.exports = config;
