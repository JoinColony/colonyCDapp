declare namespace ReputationAmountInputCssNamespace {
  export interface IReputationAmountInputCss {
    inputContainer: string;
    inputText: string;
    percentageSign: string;
  }
}

declare const ReputationAmountInputCssModule: ReputationAmountInputCssNamespace.IReputationAmountInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReputationAmountInputCssNamespace.IReputationAmountInputCss;
};

export = ReputationAmountInputCssModule;
