declare namespace StakingWidgetCssNamespace {
  export interface IStakingWidgetCss {
    loading: string;
    main: string;
  }
}

declare const StakingWidgetCssModule: StakingWidgetCssNamespace.IStakingWidgetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingWidgetCssNamespace.IStakingWidgetCss;
};

export = StakingWidgetCssModule;
