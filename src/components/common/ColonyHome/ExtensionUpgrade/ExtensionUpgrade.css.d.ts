declare namespace ExtensionUpgradeCssNamespace {
  export interface IExtensionUpgradeCss {
    controls: string;
    upgradeBanner: string;
    upgradeBannerContainer: string;
  }
}

declare const ExtensionUpgradeCssModule: ExtensionUpgradeCssNamespace.IExtensionUpgradeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExtensionUpgradeCssNamespace.IExtensionUpgradeCss;
};

export = ExtensionUpgradeCssModule;
