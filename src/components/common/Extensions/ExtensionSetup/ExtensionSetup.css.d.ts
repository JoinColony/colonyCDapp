declare namespace ExtensionSetupCssNamespace {
  export interface IExtensionSetupCss {
    complementaryLabel: string;
    descriptionExample: string;
    input: string;
    inputContainer: string;
    inputsDescription: string;
  }
}

declare const ExtensionSetupCssModule: ExtensionSetupCssNamespace.IExtensionSetupCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExtensionSetupCssNamespace.IExtensionSetupCss;
};

export = ExtensionSetupCssModule;
