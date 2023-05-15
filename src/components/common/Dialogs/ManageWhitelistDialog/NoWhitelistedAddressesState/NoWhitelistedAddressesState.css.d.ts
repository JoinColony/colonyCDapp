declare namespace NoWhitelistedAddressesStateCssNamespace {
  export interface INoWhitelistedAddressesStateCss {
    desc: string;
    main: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    title: string;
    version: string;
  }
}

declare const NoWhitelistedAddressesStateCssModule: NoWhitelistedAddressesStateCssNamespace.INoWhitelistedAddressesStateCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NoWhitelistedAddressesStateCssNamespace.INoWhitelistedAddressesStateCss;
};

export = NoWhitelistedAddressesStateCssModule;
