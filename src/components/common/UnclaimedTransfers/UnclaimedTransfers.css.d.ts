declare namespace UnclaimedTransfersCssNamespace {
  export interface IUnclaimedTransfersCss {
    main: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    title: string;
    version: string;
  }
}

declare const UnclaimedTransfersCssModule: UnclaimedTransfersCssNamespace.IUnclaimedTransfersCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UnclaimedTransfersCssNamespace.IUnclaimedTransfersCss;
};

export = UnclaimedTransfersCssModule;
