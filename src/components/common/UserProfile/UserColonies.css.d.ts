declare namespace UserColoniesCssNamespace {
  export interface IUserColoniesCss {
    createColonyLink: string;
    userHighlight: string;
  }
}

declare const UserColoniesCssModule: UserColoniesCssNamespace.IUserColoniesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserColoniesCssNamespace.IUserColoniesCss;
};

export = UserColoniesCssModule;
