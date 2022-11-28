declare namespace ExtensionStatusCssNamespace {
  export interface IExtensionStatusCss {
    tagContainer: string;
  }
}

declare const ExtensionStatusCssModule: ExtensionStatusCssNamespace.IExtensionStatusCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExtensionStatusCssNamespace.IExtensionStatusCss;
};

export = ExtensionStatusCssModule;
