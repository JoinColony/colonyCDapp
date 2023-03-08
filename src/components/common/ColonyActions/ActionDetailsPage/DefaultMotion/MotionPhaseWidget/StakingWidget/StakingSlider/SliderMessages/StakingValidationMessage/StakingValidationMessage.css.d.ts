declare namespace StakingValidationMessageCssNamespace {
  export interface IStakingValidationMessageCss {
    activateTokens: string;
    validationError: string;
    validationErrorValues: string;
  }
}

declare const StakingValidationMessageCssModule: StakingValidationMessageCssNamespace.IStakingValidationMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingValidationMessageCssNamespace.IStakingValidationMessageCss;
};

export = StakingValidationMessageCssModule;
