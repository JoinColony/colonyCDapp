declare namespace ContractVersionSectionCssNamespace {
  export interface IContractVersionSectionCss {
    contractVersionLine: string;
    contractVersionNumber: string;
    divider: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ContractVersionSectionCssModule: ContractVersionSectionCssNamespace.IContractVersionSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContractVersionSectionCssNamespace.IContractVersionSectionCss;
};

export = ContractVersionSectionCssModule;
