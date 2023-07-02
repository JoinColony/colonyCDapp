declare namespace ActionDetailsPageEventCssNamespace {
  export interface IActionDetailsPageEventCss {
    main: string;
  }
}

declare const ActionDetailsPageEventCssModule: ActionDetailsPageEventCssNamespace.IActionDetailsPageEventCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionDetailsPageEventCssNamespace.IActionDetailsPageEventCss;
};

export = ActionDetailsPageEventCssModule;
