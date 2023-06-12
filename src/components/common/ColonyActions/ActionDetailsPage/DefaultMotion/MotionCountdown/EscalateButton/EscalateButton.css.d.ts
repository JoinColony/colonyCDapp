declare namespace EscalateButtonCssNamespace {
  export interface IEscalateButtonCss {
    escalation: string;
    helpEscalate: string;
    tooltip: string;
  }
}

declare const EscalateButtonCssModule: EscalateButtonCssNamespace.IEscalateButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EscalateButtonCssNamespace.IEscalateButtonCss;
};

export = EscalateButtonCssModule;
