declare namespace FieldSetCssNamespace {
  export interface IFieldSetCss {
    alignRight: string;
    main: string;
  }
}

declare const FieldSetCssModule: FieldSetCssNamespace.IFieldSetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FieldSetCssNamespace.IFieldSetCss;
};

export = FieldSetCssModule;
