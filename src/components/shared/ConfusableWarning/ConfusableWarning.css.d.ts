declare namespace ConfusableWarningCssNamespace {
  export interface IConfusableWarningCss {
    noReputation: string;
    reputationContainer: string;
    reputationLabel: string;
    warningContainer: string;
    warningLabel: string;
    warningText: string;
  }
}

declare const ConfusableWarningCssModule: ConfusableWarningCssNamespace.IConfusableWarningCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConfusableWarningCssNamespace.IConfusableWarningCss;
};

export = ConfusableWarningCssModule;
