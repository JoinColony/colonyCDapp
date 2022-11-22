declare namespace CreateColonyCardRowCssNamespace {
  export interface ICreateColonyCardRowCss {
    cardRow: string;
    firstValue: string;
    secondValue: string;
    tokenName: string;
    tokenSymbol: string;
    username: string;
  }
}

declare const CreateColonyCardRowCssModule: CreateColonyCardRowCssNamespace.ICreateColonyCardRowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateColonyCardRowCssNamespace.ICreateColonyCardRowCss;
};

export = CreateColonyCardRowCssModule;
