declare namespace UnlockTokenFormCssNamespace {
  export interface IUnlockTokenFormCss {
    learnMoreLink: string;
    noPermissionMessage: string;
    note: string;
    unlocked: string;
    wrapper: string;
  }
}

declare const UnlockTokenFormCssModule: UnlockTokenFormCssNamespace.IUnlockTokenFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UnlockTokenFormCssNamespace.IUnlockTokenFormCss;
};

export = UnlockTokenFormCssModule;
