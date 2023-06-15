declare namespace ProfileTemplateCssNamespace {
  export interface IProfileTemplateCss {
    header: string;
    main: string;
    mainContainer: string;
    mainContent: string;
    mappings: string;
    names: string;
    paddingHorizontal: string;
    query850: string;
    sidebar: string;
    sidebarWidth: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    themeAlt: string;
    version: string;
  }
}

declare const ProfileTemplateCssModule: ProfileTemplateCssNamespace.IProfileTemplateCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProfileTemplateCssNamespace.IProfileTemplateCss;
};

export = ProfileTemplateCssModule;
