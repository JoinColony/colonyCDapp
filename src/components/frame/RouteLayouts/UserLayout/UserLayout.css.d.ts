declare namespace UserLayoutCssNamespace {
  export interface IUserLayoutCss {
    coloniesList: string;
    head: string;
  }
}

declare const UserLayoutCssModule: UserLayoutCssNamespace.IUserLayoutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserLayoutCssNamespace.IUserLayoutCss;
};

export = UserLayoutCssModule;
