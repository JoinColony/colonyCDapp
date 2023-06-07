declare namespace ButtonModuleCssNamespace {
  export interface IButtonModuleCss {
    pending: string;
    primaryOutline: string;
    primarySolid: string;
    quaternaryOutline: string;
    quinary: string;
    secondaryOutline: string;
    secondarySolid: string;
    tertiaryOutline: string;
    textButton: string;
  }
}

declare const ButtonModuleCssModule: ButtonModuleCssNamespace.IButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonModuleCssNamespace.IButtonModuleCss;
};

export = ButtonModuleCssModule;
