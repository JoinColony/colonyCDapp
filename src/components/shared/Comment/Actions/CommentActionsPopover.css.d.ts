declare namespace CommentActionsPopoverCssNamespace {
  export interface ICommentActionsPopoverCss {
    actionButton: string;
  }
}

declare const CommentActionsPopoverCssModule: CommentActionsPopoverCssNamespace.ICommentActionsPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CommentActionsPopoverCssNamespace.ICommentActionsPopoverCss;
};

export = CommentActionsPopoverCssModule;
