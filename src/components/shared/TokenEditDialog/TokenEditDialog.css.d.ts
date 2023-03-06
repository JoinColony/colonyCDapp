declare namespace TokenEditDialogCssNamespace {
  export interface ITokenEditDialogCss {
    description: string;
    marginSize: string;
    noPermissionMessage: string;
    textarea: string;
    tokenChoiceContainer: string;
    wideButton: string;
  }
}

declare const TokenEditDialogCssModule: TokenEditDialogCssNamespace.ITokenEditDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenEditDialogCssNamespace.ITokenEditDialogCss;
};

export = TokenEditDialogCssModule;
