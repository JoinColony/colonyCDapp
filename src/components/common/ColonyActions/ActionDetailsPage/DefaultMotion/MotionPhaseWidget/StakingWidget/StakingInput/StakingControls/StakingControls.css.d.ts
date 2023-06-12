declare namespace StakingControlsCssNamespace {
  export interface IStakingControlsCss {
    buttonGroup: string;
  }
}

declare const StakingControlsCssModule: StakingControlsCssNamespace.IStakingControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingControlsCssNamespace.IStakingControlsCss;
};

export = StakingControlsCssModule;
