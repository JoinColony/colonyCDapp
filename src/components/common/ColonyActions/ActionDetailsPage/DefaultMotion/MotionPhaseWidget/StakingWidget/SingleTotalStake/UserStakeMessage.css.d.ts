declare namespace UserStakeMessageCssNamespace {
  export interface IUserStakeMessageCss {
    userStake: string;
  }
}

declare const UserStakeMessageCssModule: UserStakeMessageCssNamespace.IUserStakeMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserStakeMessageCssNamespace.IUserStakeMessageCss;
};

export = UserStakeMessageCssModule;
