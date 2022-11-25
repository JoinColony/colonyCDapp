declare namespace CommentInputCssNamespace {
  export interface ICommentInputCss {
    commentBox: string;
    inputBackground: string;
    main: string;
    sendInstructions: string;
    sendInstructionsFadeIn: string;
    shadow: string;
    submitting: string;
  }
}

declare const CommentInputCssModule: CommentInputCssNamespace.ICommentInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CommentInputCssNamespace.ICommentInputCss;
};

export = CommentInputCssModule;
