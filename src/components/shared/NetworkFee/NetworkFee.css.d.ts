declare namespace NetworkFeeCssNamespace {
  export interface INetworkFeeCss {
    networkFee: string;
  }
}

declare const NetworkFeeCssModule: NetworkFeeCssNamespace.INetworkFeeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NetworkFeeCssNamespace.INetworkFeeCss;
};

export = NetworkFeeCssModule;
