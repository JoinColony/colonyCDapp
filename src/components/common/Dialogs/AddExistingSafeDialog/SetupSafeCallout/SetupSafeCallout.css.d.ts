declare namespace SetupSafeCalloutCssNamespace {
  export interface ISetupSafeCalloutCss {
    callout: string;
    calloutContainer: string;
    calloutLink: string;
    calloutWarning: string;
    warningIcon: string;
    warningIconCheckSafe: string;
  }
}

declare const SetupSafeCalloutCssModule: SetupSafeCalloutCssNamespace.ISetupSafeCalloutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SetupSafeCalloutCssNamespace.ISetupSafeCalloutCss;
};

export = SetupSafeCalloutCssModule;
