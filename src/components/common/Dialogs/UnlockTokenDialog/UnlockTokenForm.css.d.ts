declare namespace UnlockTokenFormCssNamespace {
  export interface IUnlockTokenFormCss {
    headingContainer: string;
    learnMoreLink: string;
    modalHeading: string;
    motionVoteDomain: string;
    noPermissionMessage: string;
    note: string;
    unlocked: string;
    wideButton: string;
    wrapper: string;
  }
}

declare const UnlockTokenFormCssModule: UnlockTokenFormCssNamespace.IUnlockTokenFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UnlockTokenFormCssNamespace.IUnlockTokenFormCss;
};

export = UnlockTokenFormCssModule;
