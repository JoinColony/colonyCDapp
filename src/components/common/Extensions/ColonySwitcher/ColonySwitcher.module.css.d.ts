declare namespace ColonySwitcherModuleCssNamespace {
  export interface IColonySwitcherModuleCss {
    tooltipContainer: string;
  }
}

declare const ColonySwitcherModuleCssModule: ColonySwitcherModuleCssNamespace.IColonySwitcherModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonySwitcherModuleCssNamespace.IColonySwitcherModuleCss;
};

export = ColonySwitcherModuleCssModule;
