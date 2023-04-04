declare namespace MinimumStakeMessageCssNamespace {
  export interface IMinimumStakeMessageCss {
    minAmount: string;
  }
}

declare const MinimumStakeMessageCssModule: MinimumStakeMessageCssNamespace.IMinimumStakeMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MinimumStakeMessageCssNamespace.IMinimumStakeMessageCss;
};

export = MinimumStakeMessageCssModule;
