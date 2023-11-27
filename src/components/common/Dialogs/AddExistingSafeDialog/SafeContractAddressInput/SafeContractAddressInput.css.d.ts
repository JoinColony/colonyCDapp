declare namespace SafeContractAddressInputCssNamespace {
  export interface ISafeContractAddressInputCss {
    contractAddressContainer: string;
  }
}

declare const SafeContractAddressInputCssModule: SafeContractAddressInputCssNamespace.ISafeContractAddressInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeContractAddressInputCssNamespace.ISafeContractAddressInputCss;
};

export = SafeContractAddressInputCssModule;
