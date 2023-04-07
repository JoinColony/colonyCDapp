declare namespace RevealWidgetHeadingCssNamespace {
  export interface IRevealWidgetHeadingCss {
    main: string;
    voteHiddenInfo: string;
  }
}

declare const RevealWidgetHeadingCssModule: RevealWidgetHeadingCssNamespace.IRevealWidgetHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RevealWidgetHeadingCssNamespace.IRevealWidgetHeadingCss;
};

export = RevealWidgetHeadingCssModule;
