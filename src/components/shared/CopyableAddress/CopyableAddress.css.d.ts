declare namespace CopyableAddressCssNamespace {
  export interface ICopyableAddressCss {
    address: string;
    addressContainer: string;
    boldAddress: string;
    copyButton: string;
    main: string;
    themeBig: string;
  }
}

declare const CopyableAddressCssModule: CopyableAddressCssNamespace.ICopyableAddressCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CopyableAddressCssNamespace.ICopyableAddressCss;
};

export = CopyableAddressCssModule;
