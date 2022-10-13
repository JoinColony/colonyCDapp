declare namespace ColonyUpgradeCssNamespace {
  export interface IColonyUpgradeCss {
    controls: string;
    upgradeBanner: string;
    upgradeBannerContainer: string;
  }
}

declare const ColonyUpgradeCssModule: ColonyUpgradeCssNamespace.IColonyUpgradeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyUpgradeCssNamespace.IColonyUpgradeCss;
};

export = ColonyUpgradeCssModule;
