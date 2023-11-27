declare namespace WhitelistedAddressesCssNamespace {
  export interface IWhitelistedAddressesCss {
    container: string;
    icon: string;
    input: string;
    main: string;
    searchContainer: string;
  }
}

declare const WhitelistedAddressesCssModule: WhitelistedAddressesCssNamespace.IWhitelistedAddressesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WhitelistedAddressesCssNamespace.IWhitelistedAddressesCss;
};

export = WhitelistedAddressesCssModule;
