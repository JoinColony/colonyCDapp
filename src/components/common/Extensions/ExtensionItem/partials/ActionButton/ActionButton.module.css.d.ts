declare namespace ActionButtonModuleCssNamespace {
  export interface IActionButtonModuleCss {
    button: string;
  }
}

declare const ActionButtonModuleCssModule: ActionButtonModuleCssNamespace.IActionButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionButtonModuleCssNamespace.IActionButtonModuleCss;
};

export = ActionButtonModuleCssModule;
