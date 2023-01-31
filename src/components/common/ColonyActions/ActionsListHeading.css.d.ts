declare namespace ActionsListHeadingCssNamespace {
  export interface IActionsListHeadingCss {
    bar: string;
    link: string;
    title: string;
  }
}

declare const ActionsListHeadingCssModule: ActionsListHeadingCssNamespace.IActionsListHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionsListHeadingCssNamespace.IActionsListHeadingCss;
};

export = ActionsListHeadingCssModule;
