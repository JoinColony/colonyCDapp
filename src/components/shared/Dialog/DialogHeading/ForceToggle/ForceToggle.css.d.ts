declare namespace ForceToggleCssNamespace {
  export interface IForceToggleCss {
    tooltip: string;
  }
}

declare const ForceToggleCssModule: ForceToggleCssNamespace.IForceToggleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ForceToggleCssNamespace.IForceToggleCss;
};

export = ForceToggleCssModule;
