declare namespace UserAdvancedSettingsCssNamespace {
  export interface IUserAdvancedSettingsCss {
    descriptions: string;
    link: string;
    mappings: string;
    metaDesc: string;
    names: string;
    query700: string;
    sectionTitle: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    toggleContainer: string;
    tooltipContainer: string;
    tooltipContent: string;
    validateButtonContainer: string;
    version: string;
  }
}

declare const UserAdvancedSettingsCssModule: UserAdvancedSettingsCssNamespace.IUserAdvancedSettingsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserAdvancedSettingsCssNamespace.IUserAdvancedSettingsCss;
};

export = UserAdvancedSettingsCssModule;
