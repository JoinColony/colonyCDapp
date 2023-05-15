declare namespace AdvancedSettingsRowCssNamespace {
  export interface IAdvancedSettingsRowCss {
    descriptions: string;
    main: string;
    mappings: string;
    metaDesc: string;
    names: string;
    query850: string;
    settingsRowExtra: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    toggleContainer: string;
    tooltipContainer: string;
    tooltipContent: string;
    version: string;
  }
}

declare const AdvancedSettingsRowCssModule: AdvancedSettingsRowCssNamespace.IAdvancedSettingsRowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AdvancedSettingsRowCssNamespace.IAdvancedSettingsRowCss;
};

export = AdvancedSettingsRowCssModule;
