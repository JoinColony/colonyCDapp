declare namespace ExtensionDetailsCssNamespace {
  export interface IExtensionDetailsCss {
    buttonWrapper: string;
    cellData: string;
    cellLabel: string;
    extensionText: string;
    header: string;
    headerLine: string;
    main: string;
  }
}

declare const ExtensionDetailsCssModule: ExtensionDetailsCssNamespace.IExtensionDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExtensionDetailsCssNamespace.IExtensionDetailsCss;
};

export = ExtensionDetailsCssModule;
