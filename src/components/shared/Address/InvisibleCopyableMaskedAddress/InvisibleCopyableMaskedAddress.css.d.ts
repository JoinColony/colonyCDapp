declare namespace InvisibleCopyableMaskedAddressCssNamespace {
  export interface IInvisibleCopyableMaskedAddressCss {
    address: string;
  }
}

declare const InvisibleCopyableMaskedAddressCssModule: InvisibleCopyableMaskedAddressCssNamespace.IInvisibleCopyableMaskedAddressCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InvisibleCopyableMaskedAddressCssNamespace.IInvisibleCopyableMaskedAddressCss;
};

export = InvisibleCopyableMaskedAddressCssModule;
