declare namespace AddItemButtonCssNamespace {
  export interface IAddItemButtonCss {
    main: string;
  }
}

declare const AddItemButtonCssModule: AddItemButtonCssNamespace.IAddItemButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddItemButtonCssNamespace.IAddItemButtonCss;
};

export = AddItemButtonCssModule;
