declare namespace ThreeColumnsModuleCssNamespace {
  export interface IThreeColumnsModuleCss {
    threeColumns: string;
  }
}

declare const ThreeColumnsModuleCssModule: ThreeColumnsModuleCssNamespace.IThreeColumnsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ThreeColumnsModuleCssNamespace.IThreeColumnsModuleCss;
};

export = ThreeColumnsModuleCssModule;
