declare namespace TokenCardCssNamespace {
  export interface ITokenCardCss {
    balanceContent: string;
    balanceNotPositive: string;
    balanceNumeral: string;
    cardFooter: string;
    cardHeading: string;
    ethUsdText: string;
    headerFooterHeights: string;
    iconContainer: string;
    main: string;
    mappings: string;
    names: string;
    nativeTokenText: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tokenLockWrapper: string;
    tokenSymbol: string;
    tooltipClassName: string;
    version: string;
  }
}

declare const TokenCardCssModule: TokenCardCssNamespace.ITokenCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenCardCssNamespace.ITokenCardCss;
};

export = TokenCardCssModule;
