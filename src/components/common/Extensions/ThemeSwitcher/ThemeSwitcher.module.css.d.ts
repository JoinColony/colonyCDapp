declare namespace ThemeSwitcherModuleCssNamespace {
  export interface IThemeSwitcherModuleCss {
    themeSwitcherSpan: string;
  }
}

declare const ThemeSwitcherModuleCssModule: ThemeSwitcherModuleCssNamespace.IThemeSwitcherModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ThemeSwitcherModuleCssNamespace.IThemeSwitcherModuleCss;
};

export = ThemeSwitcherModuleCssModule;
