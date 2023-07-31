declare namespace PermissionRequiredInfoCssNamespace {
  export interface IPermissionRequiredInfoCss {
    labelIcon: string;
    listItem: string;
    permissionList: string;
    requiredPermissionSection: string;
    section: string;
    sectionLabel: string;
    title: string;
    tooltipContent: string;
    tooltipText: string;
  }
}

declare const PermissionRequiredInfoCssModule: PermissionRequiredInfoCssNamespace.IPermissionRequiredInfoCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PermissionRequiredInfoCssNamespace.IPermissionRequiredInfoCss;
};

export = PermissionRequiredInfoCssModule;
