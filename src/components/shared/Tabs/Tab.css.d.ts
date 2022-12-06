declare namespace TabCssNamespace {
  export interface ITabCss {
    disabled: string;
    main: string;
    selected: string;
  }
}

declare const TabCssModule: TabCssNamespace.ITabCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TabCssNamespace.ITabCss;
};

export = TabCssModule;
