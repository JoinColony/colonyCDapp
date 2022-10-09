declare namespace ExternalLinkCssNamespace {
  export interface IExternalLinkCss {
    main: string;
  }
}

declare const ExternalLinkCssModule: ExternalLinkCssNamespace.IExternalLinkCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExternalLinkCssNamespace.IExternalLinkCss;
};

export = ExternalLinkCssModule;
