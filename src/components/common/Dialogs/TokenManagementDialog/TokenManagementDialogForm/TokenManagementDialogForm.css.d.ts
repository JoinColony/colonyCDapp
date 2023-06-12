declare namespace TokenManagementDialogFormCssNamespace {
  export interface ITokenManagementDialogFormCss {
    description: string;
    domainSelectContainer: string;
    marginSize: string;
    permissionChoiceContainer: string;
    singleUserContainer: string;
    textarea: string;
    tokenChoiceContainer: string;
    wideButton: string;
  }
}

declare const TokenManagementDialogFormCssModule: TokenManagementDialogFormCssNamespace.ITokenManagementDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenManagementDialogFormCssNamespace.ITokenManagementDialogFormCss;
};

export = TokenManagementDialogFormCssModule;
