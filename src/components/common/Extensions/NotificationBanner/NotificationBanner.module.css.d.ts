declare namespace NotificationBannerModuleCssNamespace {
  export interface INotificationBannerModuleCss {
    actionWrapper: string;
    banner: string;
  }
}

declare const NotificationBannerModuleCssModule: NotificationBannerModuleCssNamespace.INotificationBannerModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NotificationBannerModuleCssNamespace.INotificationBannerModuleCss;
};

export = NotificationBannerModuleCssModule;
