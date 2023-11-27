declare namespace ContractInteractionSectionCssNamespace {
  export interface IContractInteractionSectionCss {
    abiContainer: string;
    attributionMessage: string;
    contractFunctionSelectorContainer: string;
    fetchFailedErrorContainer: string;
    inputParamContainer: string;
    noUsefulMethods: string;
    singleUserPickerContainer: string;
  }
}

declare const ContractInteractionSectionCssModule: ContractInteractionSectionCssNamespace.IContractInteractionSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContractInteractionSectionCssNamespace.IContractInteractionSectionCss;
};

export = ContractInteractionSectionCssModule;
