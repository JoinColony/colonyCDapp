declare namespace CommentCssNamespace {
  export interface ICommentCss {
    actions: string;
    avatar: string;
    bannedTag: string;
    content: string;
    details: string;
    main: string;
    stateActiveActions: string;
    stateAnnotation: string;
    stateDisableHover: string;
    stateGhosted: string;
    stateHideControls: string;
    text: string;
    themeDanger: string;
    themePrimary: string;
    username: string;
  }
}

declare const CommentCssModule: CommentCssNamespace.ICommentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CommentCssNamespace.ICommentCss;
};

export = CommentCssModule;
