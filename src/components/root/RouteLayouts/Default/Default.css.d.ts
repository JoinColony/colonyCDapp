declare namespace DefaultCssNamespace {
  export interface IDefaultCss {
    children: string;
    coloniesList: string;
    content: string;
    history: string;
    main: string;
    onlyHistory: string;
  }
}

declare const DefaultCssModule: DefaultCssNamespace.IDefaultCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DefaultCssNamespace.IDefaultCss;
};

export = DefaultCssModule;
