declare namespace TooltipModuleCssNamespace {
  export interface ITooltipModuleCss {
    tooltipArrow: string;
    tooltipContainer: string;
  }
}

declare const TooltipModuleCssModule: TooltipModuleCssNamespace.ITooltipModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TooltipModuleCssNamespace.ITooltipModuleCss;
};

export = TooltipModuleCssModule;
