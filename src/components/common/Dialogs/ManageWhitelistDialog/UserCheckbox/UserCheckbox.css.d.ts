declare namespace UserCheckboxCssNamespace {
  export interface IUserCheckboxCss {
    address: string;
    checkbox: string;
    displayName: string;
    light: string;
    main: string;
    notChecked: string;
    tooltipArrow: string;
    tooltipBg: string;
    tooltipContainer: string;
    user: string;
    username: string;
    usernameSection: string;
  }
}

declare const UserCheckboxCssModule: UserCheckboxCssNamespace.IUserCheckboxCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserCheckboxCssNamespace.IUserCheckboxCss;
};

export = UserCheckboxCssModule;
