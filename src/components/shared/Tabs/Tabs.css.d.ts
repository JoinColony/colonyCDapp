declare namespace TabsCssNamespace {
  export interface ITabsCss {
    main: string;
  }
}

declare const TabsCssModule: TabsCssNamespace.ITabsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TabsCssNamespace.ITabsCss;
};

export = TabsCssModule;
