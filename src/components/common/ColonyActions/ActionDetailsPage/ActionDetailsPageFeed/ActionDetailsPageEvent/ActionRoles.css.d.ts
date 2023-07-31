declare namespace ActionRolesCssNamespace {
  export interface IActionRolesCss {
    tooltipIcon: string;
  }
}

declare const ActionRolesCssModule: ActionRolesCssNamespace.IActionRolesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionRolesCssNamespace.IActionRolesCss;
};

export = ActionRolesCssModule;
