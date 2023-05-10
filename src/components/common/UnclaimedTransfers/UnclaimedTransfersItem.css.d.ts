declare namespace UnclaimedTransfersItemCssNamespace {
  export interface IUnclaimedTransfersItemCss {
    amount: string;
    amountWrapper: string;
    button: string;
    claimWrapper: string;
    content: string;
    mappings: string;
    names: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    spaceBetween: string;
    tokenName: string;
    tokenSymbol: string;
    tokenWrapper: string;
    version: string;
  }
}

declare const UnclaimedTransfersItemCssModule: UnclaimedTransfersItemCssNamespace.IUnclaimedTransfersItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UnclaimedTransfersItemCssNamespace.IUnclaimedTransfersItemCss;
};

export = UnclaimedTransfersItemCssModule;
