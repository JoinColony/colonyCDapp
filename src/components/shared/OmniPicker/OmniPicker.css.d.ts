declare namespace OmniPickerCssNamespace {
  export interface IOmniPickerCss {
    header: string;
    headerBottom: string;
    headerTop: string;
    main: string;
  }
}

declare const OmniPickerCssModule: OmniPickerCssNamespace.IOmniPickerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OmniPickerCssNamespace.IOmniPickerCss;
};

export = OmniPickerCssModule;
