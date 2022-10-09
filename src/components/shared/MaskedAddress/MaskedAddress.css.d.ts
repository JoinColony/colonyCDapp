declare namespace MaskedAddressCssNamespace {
  export interface IMaskedAddressCss {
    address: string;
    middleSection: string;
  }
}

declare const MaskedAddressCssModule: MaskedAddressCssNamespace.IMaskedAddressCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MaskedAddressCssNamespace.IMaskedAddressCss;
};

export = MaskedAddressCssModule;
