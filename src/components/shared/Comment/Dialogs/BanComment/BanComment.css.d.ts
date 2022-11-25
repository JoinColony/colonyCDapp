declare namespace BanCommentCssNamespace {
  export interface IBanCommentCss {
    buttonContainer: string;
    cancelButtonContainer: string;
    commentContainer: string;
    confirmButtonContainer: string;
    container: string;
    modalContent: string;
    modalHeading: string;
    note: string;
    userInfoContainer: string;
    userNameAndWallet: string;
  }
}

declare const BanCommentCssModule: BanCommentCssNamespace.IBanCommentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BanCommentCssNamespace.IBanCommentCss;
};

export = BanCommentCssModule;
