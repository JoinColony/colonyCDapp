declare namespace IconTooltipCssNamespace {
  export interface IIconTooltipCss {
    hugeIcon: string;
    icon: string;
    largeIcon: string;
    main: string;
    massiveIcon: string;
    mediumIcon: string;
    sizeHuge: string;
    sizeLarge: string;
    sizeMassive: string;
    sizeMedium: string;
    sizeSmall: string;
    sizeTiny: string;
    smallIcon: string;
    tinyIcon: string;
    tooltipWrapper: string;
  }
}

declare const IconTooltipCssModule: IconTooltipCssNamespace.IIconTooltipCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IconTooltipCssNamespace.IIconTooltipCss;
};

export = IconTooltipCssModule;
