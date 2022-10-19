declare namespace ColonyTotalFundsCssNamespace {
  export interface IColonyTotalFundsCss {
    caretIcon: string;
    main: string;
    manageFundsLink: string;
    rightArrowDisplay: string;
    selectedToken: string;
    selectedTokenAmount: string;
    selectedTokenSymbol: string;
    tokenDisplayFontWeight: string;
    tokenDisplaySymbolFontSize: string;
    tokenLockWrapper: string;
    totalBalanceCopy: string;
  }
}

declare const ColonyTotalFundsCssModule: ColonyTotalFundsCssNamespace.IColonyTotalFundsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyTotalFundsCssNamespace.IColonyTotalFundsCss;
};

export = ColonyTotalFundsCssModule;
