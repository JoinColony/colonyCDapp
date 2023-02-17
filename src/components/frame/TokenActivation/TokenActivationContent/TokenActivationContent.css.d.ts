declare namespace TokenActivationContentCssNamespace {
  export interface ITokenActivationContentCss {
    activate: string;
    activateInactive: string;
    balanceAmount: string;
    balanceInfoActivate: string;
    balanceInfoWithdraw: string;
    balanceInfoWithdrawLocked: string;
    changeStateButtonsContainer: string;
    changeStateTitle: string;
    changeTokensState: string;
    dot: string;
    form: string;
    inputField: string;
    listItemActive: string;
    listItemInactive: string;
    lockedTokens: string;
    main: string;
    mainDivider: string;
    pendingError: string;
    questionmarkIcon: string;
    stakesTabTitle: string;
    tab: string;
    tabContainer: string;
    tabSelected: string;
    tabsList: string;
    tabsListContainer: string;
    tokenNumbers: string;
    tokenNumbersInactive: string;
    tokenNumbersLocked: string;
    tokenSymbol: string;
    tokenSymbolSmall: string;
    tokensDetailsContainer: string;
    totalTokens: string;
    totalTokensContainer: string;
    totalTokensSmall: string;
    withdraw: string;
    withdrawInactive: string;
  }
}

declare const TokenActivationContentCssModule: TokenActivationContentCssNamespace.ITokenActivationContentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenActivationContentCssNamespace.ITokenActivationContentCss;
};

export = TokenActivationContentCssModule;
