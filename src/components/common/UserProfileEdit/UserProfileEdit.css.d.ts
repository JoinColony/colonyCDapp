declare namespace UserProfileEditCssNamespace {
  export interface IUserProfileEditCss {
    dot: string;
    inputFieldSet: string;
    main: string;
    snackbarContainer: string;
    snackbarContainerError: string;
    snackbarContainerSuccess: string;
    snackbarDotError: string;
    snackbarDotSuccess: string;
    snackbarText: string;
    usernameContainer: string;
  }
}

declare const UserProfileEditCssModule: UserProfileEditCssNamespace.IUserProfileEditCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserProfileEditCssNamespace.IUserProfileEditCss;
};

export = UserProfileEditCssModule;
