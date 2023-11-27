declare namespace SafeInfoPopoverCssNamespace {
  export interface ISafeInfoPopoverCss {
    main: string;
    mappings: string;
    names: string;
    query700: string;
    safeLink: string;
    section: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const SafeInfoPopoverCssModule: SafeInfoPopoverCssNamespace.ISafeInfoPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeInfoPopoverCssNamespace.ISafeInfoPopoverCss;
};

export = SafeInfoPopoverCssModule;
