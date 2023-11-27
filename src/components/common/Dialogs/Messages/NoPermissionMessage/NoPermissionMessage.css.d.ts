declare namespace NoPermissionMessageCssNamespace {
  export interface INoPermissionMessageCss {
    noPermissionFromMessage: string;
  }
}

declare const NoPermissionMessageCssModule: NoPermissionMessageCssNamespace.INoPermissionMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NoPermissionMessageCssNamespace.INoPermissionMessageCss;
};

export = NoPermissionMessageCssModule;
