declare namespace ColonyCreationCardRowCssNamespace {
  export interface IColonyCreationCardRowCss {
    cardRow: string;
    firstValue: string;
    secondValue: string;
    tokenName: string;
    tokenSymbol: string;
    username: string;
  }
}

declare const ColonyCreationCardRowCssModule: ColonyCreationCardRowCssNamespace.IColonyCreationCardRowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyCreationCardRowCssNamespace.IColonyCreationCardRowCss;
};

export = ColonyCreationCardRowCssModule;
