declare namespace SmallTokenAmountMessageCssNamespace {
  export interface ISmallTokenAmountMessageCss {
    container: string;
    tooltip: string;
    tooltipIcon: string;
  }
}

declare const SmallTokenAmountMessageCssModule: SmallTokenAmountMessageCssNamespace.ISmallTokenAmountMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SmallTokenAmountMessageCssNamespace.ISmallTokenAmountMessageCss;
};

export = SmallTokenAmountMessageCssModule;
