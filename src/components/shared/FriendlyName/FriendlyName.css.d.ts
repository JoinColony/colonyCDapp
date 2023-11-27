declare namespace FriendlyNameCssNamespace {
  export interface IFriendlyNameCss {
    main: string;
    name: string;
  }
}

declare const FriendlyNameCssModule: FriendlyNameCssNamespace.IFriendlyNameCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FriendlyNameCssNamespace.IFriendlyNameCss;
};

export = FriendlyNameCssModule;
