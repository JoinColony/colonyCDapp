declare namespace AddressCssNamespace {
  export interface IAddressCss {
    address: string;
  }
}

declare const AddressCssModule: AddressCssNamespace.IAddressCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddressCssNamespace.IAddressCss;
};

export = AddressCssModule;
