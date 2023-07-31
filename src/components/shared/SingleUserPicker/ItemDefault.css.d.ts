declare namespace ItemDefaultCssNamespace {
  export interface IItemDefaultCss {
    address: string;
    dataContainer: string;
    displayName: string;
    fullName: string;
    main: string;
    mention: string;
    showAddress: string;
    thatsYou: string;
  }
}

declare const ItemDefaultCssModule: ItemDefaultCssNamespace.IItemDefaultCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ItemDefaultCssNamespace.IItemDefaultCss;
};

export = ItemDefaultCssModule;
