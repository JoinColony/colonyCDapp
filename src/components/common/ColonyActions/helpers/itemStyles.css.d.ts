declare namespace ItemStylesCssNamespace {
  export interface IItemStylesCss {
    highlight: string;
    titleDecoration: string;
    userDecoration: string;
    voteResultsWrapper: string;
  }
}

declare const ItemStylesCssModule: ItemStylesCssNamespace.IItemStylesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ItemStylesCssNamespace.IItemStylesCss;
};

export = ItemStylesCssModule;
