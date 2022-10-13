declare namespace InvisibleCopyableAddressCssNamespace {
  export interface IInvisibleCopyableAddressCss {
    addressWrapper: string;
  }
}

declare const InvisibleCopyableAddressCssModule: InvisibleCopyableAddressCssNamespace.IInvisibleCopyableAddressCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InvisibleCopyableAddressCssNamespace.IInvisibleCopyableAddressCss;
};

export = InvisibleCopyableAddressCssModule;
