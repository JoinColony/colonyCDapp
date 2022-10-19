declare namespace LayoutCssNamespace {
  export interface ILayoutCss {
    flexAlignCenter: string;
    flexAlignStart: string;
    flexContainerColumn: string;
    flexContainerRow: string;
    flexInlineChild: string;
    flexJustifyBetween: string;
    flexJustifyCenter: string;
    flexJustifyEnd: string;
    flexPullRight: string;
    isRelative: string;
    mainPadded: string;
    mainPaddedFullscreen: string;
    mainPaddedFullscreenNoBottom: string;
    mainPaddedNoBottom: string;
    marginBottomLarge: string;
    marginBottomMedium: string;
    pullRight: string;
    sectionPaddedVertical: string;
    stretch: string;
    stretchHorizontal: string;
    stretchVertical: string;
  }
}

declare const LayoutCssModule: LayoutCssNamespace.ILayoutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LayoutCssNamespace.ILayoutCss;
};

export = LayoutCssModule;
