declare namespace ColonyFinishDeploymentCssNamespace {
  export interface IColonyFinishDeploymentCss {
    finishDeploymentBanner: string;
    finishDeploymentBannerContainer: string;
  }
}

declare const ColonyFinishDeploymentCssModule: ColonyFinishDeploymentCssNamespace.IColonyFinishDeploymentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyFinishDeploymentCssNamespace.IColonyFinishDeploymentCss;
};

export = ColonyFinishDeploymentCssModule;
