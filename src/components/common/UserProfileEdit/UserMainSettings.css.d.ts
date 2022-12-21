declare namespace UserMainSettingsCssNamespace {
  export interface IUserMainSettingsCss {
    inputFieldSet: string;
    main: string;
    save: string;
    usernameContainer: string;
  }
}

declare const UserMainSettingsCssModule: UserMainSettingsCssNamespace.IUserMainSettingsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserMainSettingsCssNamespace.IUserMainSettingsCss;
};

export = UserMainSettingsCssModule;
