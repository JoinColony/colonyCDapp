declare namespace CardListCssNamespace {
  export interface ICardListCss {
    main: string;
    numCols1: string;
    numCols2: string;
    numCols3: string;
    numCols4: string;
    numCols5: string;
    numCols6: string;
    numCols7: string;
    numCols8: string;
    numCols9: string;
    numColsAuto: string;
  }
}

declare const CardListCssModule: CardListCssNamespace.ICardListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CardListCssNamespace.ICardListCss;
};

export = CardListCssModule;
