declare namespace CheckSafeCssNamespace {
  export interface ICheckSafeCss {
    chainSelect: string;
    step1Subtitle: string;
  }
}

declare const CheckSafeCssModule: CheckSafeCssNamespace.ICheckSafeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CheckSafeCssNamespace.ICheckSafeCss;
};

export = CheckSafeCssModule;
