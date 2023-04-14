declare namespace SingleTotalStakeCssNamespace {
  export interface ISingleTotalStakeCss {
    tooltip: string;
  }
}

declare const SingleTotalStakeCssModule: SingleTotalStakeCssNamespace.ISingleTotalStakeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SingleTotalStakeCssNamespace.ISingleTotalStakeCss;
};

export = SingleTotalStakeCssModule;
