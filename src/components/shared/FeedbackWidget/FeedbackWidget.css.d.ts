declare namespace FeedbackWidgetCssNamespace {
  export interface IFeedbackWidgetCss {
    heart: string;
    link: string;
    main: string;
  }
}

declare const FeedbackWidgetCssModule: FeedbackWidgetCssNamespace.IFeedbackWidgetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FeedbackWidgetCssNamespace.IFeedbackWidgetCss;
};

export = FeedbackWidgetCssModule;
