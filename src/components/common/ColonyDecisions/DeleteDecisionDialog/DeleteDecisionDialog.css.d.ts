declare namespace DeleteDecisionDialogCssNamespace {
  export interface IDeleteDecisionDialogCss {
    main: string;
  }
}

declare const DeleteDecisionDialogCssModule: DeleteDecisionDialogCssNamespace.IDeleteDecisionDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DeleteDecisionDialogCssNamespace.IDeleteDecisionDialogCss;
};

export = DeleteDecisionDialogCssModule;
