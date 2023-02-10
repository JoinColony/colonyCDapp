declare namespace BanUserCssNamespace {
  export interface IBanUserCss {
    divider: string;
    footer: string;
    infoNote: string;
    userPickerContainer: string;
  }
}

declare const BanUserCssModule: BanUserCssNamespace.IBanUserCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BanUserCssNamespace.IBanUserCss;
};

export = BanUserCssModule;
