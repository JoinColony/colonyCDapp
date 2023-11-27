declare namespace ConfirmSafeCssNamespace {
  export interface IConfirmSafeCss {
    chainName: string;
    safe: string;
    safeNameContainer: string;
    step3Instructions: string;
    summaryRow: string;
  }
}

declare const ConfirmSafeCssModule: ConfirmSafeCssNamespace.IConfirmSafeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConfirmSafeCssNamespace.IConfirmSafeCss;
};

export = ConfirmSafeCssModule;
