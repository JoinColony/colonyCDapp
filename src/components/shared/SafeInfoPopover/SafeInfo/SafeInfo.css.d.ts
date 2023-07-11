declare namespace SafeInfoCssNamespace {
  export interface ISafeInfoCss {
    address: string;
    container: string;
    safeLogo: string;
    textContainer: string;
    userName: string;
  }
}

declare const SafeInfoCssModule: SafeInfoCssNamespace.ISafeInfoCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeInfoCssNamespace.ISafeInfoCss;
};

export = SafeInfoCssModule;
