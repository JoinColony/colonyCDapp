declare namespace SafeDetailCssNamespace {
  export interface ISafeDetailCss {
    address: string;
    displayName: string;
    main: string;
    textContainer: string;
  }
}

declare const SafeDetailCssModule: SafeDetailCssNamespace.ISafeDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeDetailCssNamespace.ISafeDetailCss;
};

export = SafeDetailCssModule;
