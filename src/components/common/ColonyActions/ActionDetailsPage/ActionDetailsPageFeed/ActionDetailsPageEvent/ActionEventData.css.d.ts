declare namespace ActionEventDataCssNamespace {
  export interface IActionEventDataCss {
    content: string;
    details: string;
    text: string;
  }
}

declare const ActionEventDataCssModule: ActionEventDataCssNamespace.IActionEventDataCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionEventDataCssNamespace.IActionEventDataCss;
};

export = ActionEventDataCssModule;
