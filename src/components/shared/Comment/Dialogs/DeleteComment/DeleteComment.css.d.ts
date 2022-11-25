declare namespace DeleteCommentCssNamespace {
  export interface IDeleteCommentCss {
    comment: string;
    modalContent: string;
    modalHeading: string;
    wideButton: string;
  }
}

declare const DeleteCommentCssModule: DeleteCommentCssNamespace.IDeleteCommentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DeleteCommentCssNamespace.IDeleteCommentCss;
};

export = DeleteCommentCssModule;
