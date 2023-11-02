declare namespace ConnectSafeCssNamespace {
  export interface IConnectSafeCss {
    info: string;
    learnMoreLink: string;
    moduleAddressSubtitle: string;
    moduleContractAddressContainer: string;
    moduleLabel: string;
    moduleLinkSection: string;
    warning: string;
    warningIcon: string;
  }
}

declare const ConnectSafeCssModule: ConnectSafeCssNamespace.IConnectSafeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConnectSafeCssNamespace.IConnectSafeCss;
};

export = ConnectSafeCssModule;
