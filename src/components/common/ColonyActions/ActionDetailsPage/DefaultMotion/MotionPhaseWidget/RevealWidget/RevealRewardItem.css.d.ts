declare namespace RevealRewardItemCssNamespace {
  export interface IRevealRewardItemCss {
    tokenIcon: string;
  }
}

declare const RevealRewardItemCssModule: RevealRewardItemCssNamespace.IRevealRewardItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RevealRewardItemCssNamespace.IRevealRewardItemCss;
};

export = RevealRewardItemCssModule;
