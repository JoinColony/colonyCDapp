declare namespace ToolbarCssNamespace {
  export interface IToolbarCss {
    inputWrapper: string;
    main: string;
    selected: string;
  }
}

declare const ToolbarCssModule: ToolbarCssNamespace.IToolbarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToolbarCssNamespace.IToolbarCss;
};

export = ToolbarCssModule;
