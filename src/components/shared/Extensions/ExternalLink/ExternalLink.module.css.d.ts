declare namespace ExternalLinkModuleCssNamespace {
  export interface IExternalLinkModuleCss {
    main: string;
  }
}

declare const ExternalLinkModuleCssModule: ExternalLinkModuleCssNamespace.IExternalLinkModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExternalLinkModuleCssNamespace.IExternalLinkModuleCss;
};

export = ExternalLinkModuleCssModule;
