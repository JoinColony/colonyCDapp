declare namespace ActionTypeDetailCssNamespace {
  export interface IActionTypeDetailCss {
    text: string;
  }
}

declare const ActionTypeDetailCssModule: ActionTypeDetailCssNamespace.IActionTypeDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionTypeDetailCssNamespace.IActionTypeDetailCss;
};

export = ActionTypeDetailCssModule;
