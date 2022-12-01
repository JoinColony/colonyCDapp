declare namespace TokenInfoPopoverCssNamespace {
  export interface ITokenInfoPopoverCss {
    addToWallet: string;
    address: string;
    displayName: string;
    etherscanLink: string;
    main: string;
    nativeTokenMessage: string;
    section: string;
    symbol: string;
    textContainer: string;
    userName: string;
  }
}

declare const TokenInfoPopoverCssModule: TokenInfoPopoverCssNamespace.ITokenInfoPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenInfoPopoverCssNamespace.ITokenInfoPopoverCss;
};

export = TokenInfoPopoverCssModule;
