declare namespace MultiLineEditCssNamespace {
  export interface IMultiLineEditCss {
    main: string;
  }
}

declare const MultiLineEditCssModule: MultiLineEditCssNamespace.IMultiLineEditCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MultiLineEditCssNamespace.IMultiLineEditCss;
};

export = MultiLineEditCssModule;
