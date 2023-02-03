declare namespace ActionsPageEventCssNamespace {
  export interface IActionsPageEventCss {
    amountTag: string;
    content: string;
    details: string;
    highlight: string;
    main: string;
    text: string;
    tooltipIcon: string;
    userDecoration: string;
    wrapper: string;
  }
}

declare const ActionsPageEventCssModule: ActionsPageEventCssNamespace.IActionsPageEventCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionsPageEventCssNamespace.IActionsPageEventCss;
};

export = ActionsPageEventCssModule;
