declare namespace RequiredStakeMessageCssNamespace {
  export interface IRequiredStakeMessageCss {
    amount: string;
    requiredStakeAboveThreshold: string;
    requiredStakeText: string;
    requiredStakeUnderThreshold: string;
  }
}

declare const RequiredStakeMessageCssModule: RequiredStakeMessageCssNamespace.IRequiredStakeMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RequiredStakeMessageCssNamespace.IRequiredStakeMessageCss;
};

export = RequiredStakeMessageCssModule;
