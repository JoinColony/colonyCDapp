declare namespace ColonyTotalFundsPopoverCssNamespace {
  export interface IColonyTotalFundsPopoverCss {
    entryHoverColor: string;
    main: string;
    token: string;
    tokenBalance: string;
    tokenIcon: string;
    tokenIconContainer: string;
    tokenInfoContainer: string;
    tokenInfoContainerActive: string;
    tokenSymbol: string;
  }
}

declare const ColonyTotalFundsPopoverCssModule: ColonyTotalFundsPopoverCssNamespace.IColonyTotalFundsPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyTotalFundsPopoverCssNamespace.IColonyTotalFundsPopoverCss;
};

export = ColonyTotalFundsPopoverCssModule;
