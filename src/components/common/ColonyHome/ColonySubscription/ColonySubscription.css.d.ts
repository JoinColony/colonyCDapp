declare namespace ColonySubscriptionCssNamespace {
  export interface IColonySubscriptionCss {
    colonyAddress: string;
    colonyJoin: string;
    colonyJoinBtn: string;
    colonySubscribed: string;
    main: string;
    menuActive: string;
    menuIconContainer: string;
  }
}

declare const ColonySubscriptionCssModule: ColonySubscriptionCssNamespace.IColonySubscriptionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonySubscriptionCssNamespace.IColonySubscriptionCss;
};

export = ColonySubscriptionCssModule;
