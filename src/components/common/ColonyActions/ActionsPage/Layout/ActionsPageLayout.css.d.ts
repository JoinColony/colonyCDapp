declare namespace ActionsPageLayoutCssNamespace {
  export interface IActionsPageLayoutCss {
    main: string;
  }
}

declare const ActionsPageLayoutCssModule: ActionsPageLayoutCssNamespace.IActionsPageLayoutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionsPageLayoutCssNamespace.IActionsPageLayoutCss;
};

export = ActionsPageLayoutCssModule;
