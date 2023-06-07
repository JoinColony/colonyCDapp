declare namespace ExtensionStatusBadgeModuleCssNamespace {
  export interface IExtensionStatusBadgeModuleCss {
    badge: string;
  }
}

declare const ExtensionStatusBadgeModuleCssModule: ExtensionStatusBadgeModuleCssNamespace.IExtensionStatusBadgeModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExtensionStatusBadgeModuleCssNamespace.IExtensionStatusBadgeModuleCss;
};

export = ExtensionStatusBadgeModuleCssModule;
