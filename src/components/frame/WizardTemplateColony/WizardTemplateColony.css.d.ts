declare namespace WizardTemplateColonyCssNamespace {
  export interface IWizardTemplateColonyCss {
    address: string;
    content: string;
    copy: string;
    header: string;
    headerWallet: string;
    hello: string;
    layoutMain: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    steps: string;
    version: string;
    wallet: string;
  }
}

declare const WizardTemplateColonyCssModule: WizardTemplateColonyCssNamespace.IWizardTemplateColonyCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WizardTemplateColonyCssNamespace.IWizardTemplateColonyCss;
};

export = WizardTemplateColonyCssModule;
