declare namespace SingleLineEditCssNamespace {
  export interface ISingleLineEditCss {
    inputContainer: string;
    main: string;
    maxLengthText: string;
    notEditingValue: string;
    notEditingValueContainer: string;
    notEditingValueWrapper: string;
    stateHasReachedMaxLength: string;
    stateHasValue: string;
    stateReadOnly: string;
  }
}

declare const SingleLineEditCssModule: SingleLineEditCssNamespace.ISingleLineEditCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SingleLineEditCssNamespace.ISingleLineEditCss;
};

export = SingleLineEditCssModule;
