declare namespace UserAdvanceSettingsCssNamespace {
  export interface IUserAdvanceSettingsCss {
    descriptions: string;
    link: string;
    mappings: string;
    metaDesc: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    toggleContainer: string;
    tooltipContainer: string;
    tooltipContent: string;
    version: string;
  }
}

declare const UserAdvanceSettingsCssModule: UserAdvanceSettingsCssNamespace.IUserAdvanceSettingsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserAdvanceSettingsCssNamespace.IUserAdvanceSettingsCss;
};

export = UserAdvanceSettingsCssModule;
