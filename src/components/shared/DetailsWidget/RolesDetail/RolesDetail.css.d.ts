declare namespace RolesDetailCssNamespace {
  export interface IRolesDetailCss {
    roleList: string;
    roleListItem: string;
  }
}

declare const RolesDetailCssModule: RolesDetailCssNamespace.IRolesDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RolesDetailCssNamespace.IRolesDetailCss;
};

export = RolesDetailCssModule;
