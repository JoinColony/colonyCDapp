declare namespace ReputationChangeDetailCssNamespace {
  export interface IReputationChangeDetailCss {
    main: string;
  }
}

declare const ReputationChangeDetailCssModule: ReputationChangeDetailCssNamespace.IReputationChangeDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReputationChangeDetailCssNamespace.IReputationChangeDetailCss;
};

export = ReputationChangeDetailCssModule;
