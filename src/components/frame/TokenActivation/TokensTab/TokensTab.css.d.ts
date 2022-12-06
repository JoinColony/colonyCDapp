declare namespace TokensTabCssNamespace {
  export interface ITokensTabCss {
    activate: string;
    activateInactive: string;
    balanceAmount: string;
    balanceInfoActivate: string;
    balanceInfoWithdraw: string;
    balanceInfoWithdrawLocked: string;
    changeStateButtonsContainer: string;
    changeStateTitle: string;
    changeTokensState: string;
    claimsContainer: string;
    form: string;
    inputField: string;
    listItemActive: string;
    listItemInactive: string;
    lockedTokens: string;
    mainDivider: string;
    mappings: string;
    names: string;
    noClaims: string;
    pendingError: string;
    query700: string;
    questionmarkIcon: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tokenNumbers: string;
    tokenNumbersInactive: string;
    tokenNumbersLocked: string;
    tokenSymbol: string;
    tokenSymbolSmall: string;
    tokensDetailsContainer: string;
    totalTokens: string;
    totalTokensContainer: string;
    totalTokensSmall: string;
    version: string;
    withdraw: string;
    withdrawInactive: string;
  }
}

declare const TokensTabCssModule: TokensTabCssNamespace.ITokensTabCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokensTabCssNamespace.ITokensTabCss;
};

export = TokensTabCssModule;
