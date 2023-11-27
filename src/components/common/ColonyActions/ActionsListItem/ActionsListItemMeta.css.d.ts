declare namespace ActionsListItemMetaCssNamespace {
  export interface IActionsListItemMetaCss {
    commentCount: string;
    commentCountIcon: string;
    domain: string;
    separator: string;
  }
}

declare const ActionsListItemMetaCssModule: ActionsListItemMetaCssNamespace.IActionsListItemMetaCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionsListItemMetaCssNamespace.IActionsListItemMetaCss;
};

export = ActionsListItemMetaCssModule;
