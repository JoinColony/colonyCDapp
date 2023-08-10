declare namespace RemoveDecisionMessageCssNamespace {
  export interface IRemoveDecisionMessageCss {
    redTitle: string;
  }
}

declare const RemoveDecisionMessageCssModule: RemoveDecisionMessageCssNamespace.IRemoveDecisionMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RemoveDecisionMessageCssNamespace.IRemoveDecisionMessageCss;
};

export = RemoveDecisionMessageCssModule;
