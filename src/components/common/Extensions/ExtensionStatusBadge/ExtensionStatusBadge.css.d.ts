declare namespace ExtensionStatusBadgeCssNamespace {
  export interface IExtensionStatusBadgeCss {
    tagContainer: string;
  }
}

declare const ExtensionStatusBadgeCssModule: ExtensionStatusBadgeCssNamespace.IExtensionStatusBadgeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExtensionStatusBadgeCssNamespace.IExtensionStatusBadgeCss;
};

export = ExtensionStatusBadgeCssModule;
