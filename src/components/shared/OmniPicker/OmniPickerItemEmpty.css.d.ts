declare namespace OmniPickerItemEmptyCssNamespace {
  export interface IOmniPickerItemEmptyCss {
    main: string;
  }
}

declare const OmniPickerItemEmptyCssModule: OmniPickerItemEmptyCssNamespace.IOmniPickerItemEmptyCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OmniPickerItemEmptyCssNamespace.IOmniPickerItemEmptyCss;
};

export = OmniPickerItemEmptyCssModule;
