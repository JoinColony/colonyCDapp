declare namespace PillsBaseModuleCssNamespace {
  export interface IPillsBaseModuleCss {
    pills: string;
  }
}

declare const PillsBaseModuleCssModule: PillsBaseModuleCssNamespace.IPillsBaseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PillsBaseModuleCssNamespace.IPillsBaseModuleCss;
};

export = PillsBaseModuleCssModule;
