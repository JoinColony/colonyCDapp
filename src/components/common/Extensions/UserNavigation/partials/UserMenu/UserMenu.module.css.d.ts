declare namespace UserMenuModuleCssNamespace {
  export interface IUserMenuModuleCss {
    button: string;
    buttonBack: string;
    link: string;
    mobileButtons: string;
    userMenuPopup: string;
  }
}

declare const UserMenuModuleCssModule: UserMenuModuleCssNamespace.IUserMenuModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserMenuModuleCssNamespace.IUserMenuModuleCss;
};

export = UserMenuModuleCssModule;
