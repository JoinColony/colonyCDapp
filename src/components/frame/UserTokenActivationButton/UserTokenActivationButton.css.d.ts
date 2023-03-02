declare namespace UserTokenActivationButtonCssNamespace {
  export interface IUserTokenActivationButtonCss {
    dot: string;
    dotInactive: string;
    tokens: string;
    tokensNumber: string;
    tooltip: string;
  }
}

declare const UserTokenActivationButtonCssModule: UserTokenActivationButtonCssNamespace.IUserTokenActivationButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserTokenActivationButtonCssNamespace.IUserTokenActivationButtonCss;
};

export = UserTokenActivationButtonCssModule;
