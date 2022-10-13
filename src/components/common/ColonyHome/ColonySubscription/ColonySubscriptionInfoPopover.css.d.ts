declare namespace ColonySubscriptionInfoPopoverCssNamespace {
  export interface IColonySubscriptionInfoPopoverCss {
    colonyAvatar: string;
    colonyDetails: string;
    colonyInfo: string;
    colonyInfoAddress: string;
    colonyInfoEns: string;
    colonyInfoItem: string;
    colonyInfoTitle: string;
    main: string;
    nativeTokenAddress: string;
    nativeTokenTitle: string;
    unsubscribeFromColony: string;
  }
}

declare const ColonySubscriptionInfoPopoverCssModule: ColonySubscriptionInfoPopoverCssNamespace.IColonySubscriptionInfoPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonySubscriptionInfoPopoverCssNamespace.IColonySubscriptionInfoPopoverCss;
};

export = ColonySubscriptionInfoPopoverCssModule;
