declare namespace TransferNftSectionCssNamespace {
  export interface ITransferNftSectionCss {
    error: string;
    loading: string;
    nftContentLabel: string;
    nftContentValue: string;
    nftContractAvatar: string;
    nftContractContent: string;
    nftDetails: string;
    nftDetailsContainer: string;
    nftImage: string;
    nftImageContainer: string;
    nftLineItem: string;
    nftName: string;
    nftPicker: string;
    notFound: string;
    recipientPicker: string;
  }
}

declare const TransferNftSectionCssModule: TransferNftSectionCssNamespace.ITransferNftSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransferNftSectionCssNamespace.ITransferNftSectionCss;
};

export = TransferNftSectionCssModule;
