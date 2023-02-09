declare namespace CountDownTimerCssNamespace {
  export interface ICountDownTimerCss {
    container: string;
    loader: string;
    time: string;
    tooltipIcon: string;
  }
}

declare const CountDownTimerCssModule: CountDownTimerCssNamespace.ICountDownTimerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CountDownTimerCssNamespace.ICountDownTimerCss;
};

export = CountDownTimerCssModule;
