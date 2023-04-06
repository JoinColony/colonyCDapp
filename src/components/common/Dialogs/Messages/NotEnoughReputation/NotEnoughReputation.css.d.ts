declare namespace NotEnoughReputationCssNamespace {
  export interface INotEnoughReputationCss {
    container: string;
    marginTopNegative: string;
    text: string;
    title: string;
  }
}

declare const NotEnoughReputationCssModule: NotEnoughReputationCssNamespace.INotEnoughReputationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NotEnoughReputationCssNamespace.INotEnoughReputationCss;
};

export = NotEnoughReputationCssModule;
