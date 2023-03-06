declare namespace MintTokenDialogFormCssNamespace {
  export interface IMintTokenDialogFormCss {
    annotation: string;
    inputComponent: string;
    inputContainer: string;
    mappings: string;
    names: string;
    nativeToken: string;
    noPermissionMessage: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const MintTokenDialogFormCssModule: MintTokenDialogFormCssNamespace.IMintTokenDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MintTokenDialogFormCssNamespace.IMintTokenDialogFormCss;
};

export = MintTokenDialogFormCssModule;
