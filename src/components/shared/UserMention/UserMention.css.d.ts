declare namespace UserMentionCssNamespace {
  export interface IUserMentionCss {
    mention: string;
  }
}

declare const UserMentionCssModule: UserMentionCssNamespace.IUserMentionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserMentionCssNamespace.IUserMentionCss;
};

export = UserMentionCssModule;
