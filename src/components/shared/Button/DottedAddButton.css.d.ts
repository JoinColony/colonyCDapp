declare namespace DottedAddButtonCssNamespace {
  export interface IDottedAddButtonCss {
    buttonIcon: string;
    buttonTextContainer: string;
  }
}

declare const DottedAddButtonCssModule: DottedAddButtonCssNamespace.IDottedAddButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DottedAddButtonCssNamespace.IDottedAddButtonCss;
};

export = DottedAddButtonCssModule;
