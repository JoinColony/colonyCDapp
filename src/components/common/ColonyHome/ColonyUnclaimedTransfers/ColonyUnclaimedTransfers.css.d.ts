declare namespace ColonyUnclaimedTransfersCssNamespace {
  export interface IColonyUnclaimedTransfersCss {
    button: string;
    firstLineContainer: string;
    main: string;
    manageFundsLink: string;
    tokenItem: string;
    tokenSymbol: string;
    tokenValue: string;
    tooltip: string;
  }
}

declare const ColonyUnclaimedTransfersCssModule: ColonyUnclaimedTransfersCssNamespace.IColonyUnclaimedTransfersCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyUnclaimedTransfersCssNamespace.IColonyUnclaimedTransfersCss;
};

export = ColonyUnclaimedTransfersCssModule;
