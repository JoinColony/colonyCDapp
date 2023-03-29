declare namespace CommentActionsCssNamespace {
  export interface ICommentActionsCss {
    actionsButton: string;
    actionsIcon: string;
    activeDropdown: string;
  }
}

declare const CommentActionsCssModule: CommentActionsCssNamespace.ICommentActionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CommentActionsCssNamespace.ICommentActionsCss;
};

export = CommentActionsCssModule;
