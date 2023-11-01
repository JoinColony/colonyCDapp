declare namespace UserPermissionsBadgeModuleCssNamespace {
  export interface IUserPermissionsBadgeModuleCss {
    badge: string;
    tooltipBadge: string;
  }
}

declare const UserPermissionsBadgeModuleCssModule: UserPermissionsBadgeModuleCssNamespace.IUserPermissionsBadgeModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserPermissionsBadgeModuleCssNamespace.IUserPermissionsBadgeModuleCss;
};

export = UserPermissionsBadgeModuleCssModule;
