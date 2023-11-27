declare namespace AddressDetailsViewCssNamespace {
  export interface IAddressDetailsViewCss {
    avatar: string;
    main: string;
    name: string;
  }
}

declare const AddressDetailsViewCssModule: AddressDetailsViewCssNamespace.IAddressDetailsViewCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddressDetailsViewCssNamespace.IAddressDetailsViewCss;
};

export = AddressDetailsViewCssModule;
