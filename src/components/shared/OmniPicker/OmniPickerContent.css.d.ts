declare namespace OmniPickerContentCssNamespace {
  export interface IOmniPickerContentCss {
    main: string;
  }
}

declare const OmniPickerContentCssModule: OmniPickerContentCssNamespace.IOmniPickerContentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OmniPickerContentCssNamespace.IOmniPickerContentCss;
};

export = OmniPickerContentCssModule;
