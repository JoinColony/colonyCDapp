declare namespace NetworkContractUpgradeDialogFormCssNamespace {
  export interface INetworkContractUpgradeDialogFormCss {
    contractVersionLine: string;
    contractVersionNumber: string;
    divider: string;
    headingContainer: string;
    highlightInstruction: string;
    loadingInfo: string;
    mappings: string;
    modalHeading: string;
    motionVoteDomain: string;
    names: string;
    noPermissionMessage: string;
    permissionsWarning: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    title: string;
    version: string;
    warningDescription: string;
    warningTitle: string;
    wideButton: string;
  }
}

declare const NetworkContractUpgradeDialogFormCssModule: NetworkContractUpgradeDialogFormCssNamespace.INetworkContractUpgradeDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NetworkContractUpgradeDialogFormCssNamespace.INetworkContractUpgradeDialogFormCss;
};

export = NetworkContractUpgradeDialogFormCssModule;
