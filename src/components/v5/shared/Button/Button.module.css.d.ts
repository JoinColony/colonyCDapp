declare namespace ButtonModuleCssNamespace {
  export interface IButtonModuleCss {
    completed: string;
    primaryOutline: string;
    primaryOutlineFull: string;
    primarySolid: string;
    quinary: string;
    secondaryOutline: string;
    secondarySolid: string;
    tertiary: string;
  }
}

declare const ButtonModuleCssModule: ButtonModuleCssNamespace.IButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonModuleCssNamespace.IButtonModuleCss;
};

export = ButtonModuleCssModule;
