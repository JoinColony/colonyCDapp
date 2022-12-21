declare namespace UserAdvancedSettingsCssNamespace {
  export interface IUserAdvancedSettingsCss {
    learnMoreLink: string;
    main: string;
  }
}

declare const UserAdvancedSettingsCssModule: UserAdvancedSettingsCssNamespace.IUserAdvancedSettingsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserAdvancedSettingsCssNamespace.IUserAdvancedSettingsCss;
};

export = UserAdvancedSettingsCssModule;
