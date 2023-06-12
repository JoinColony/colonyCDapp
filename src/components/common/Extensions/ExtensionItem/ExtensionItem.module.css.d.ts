declare namespace ExtensionItemModuleCssNamespace {
  export interface IExtensionItemModuleCss {
    extensionItemButton: string;
  }
}

declare const ExtensionItemModuleCssModule: ExtensionItemModuleCssNamespace.IExtensionItemModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExtensionItemModuleCssNamespace.IExtensionItemModuleCss;
};

export = ExtensionItemModuleCssModule;
