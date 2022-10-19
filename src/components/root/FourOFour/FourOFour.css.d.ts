declare namespace FourOFourCssNamespace {
  export interface IFourOFourCss {
    description: string;
    header: string;
    hero: string;
    herowrapper: string;
    layoutMain: string;
    logo: string;
    nakedMole: string;
    title: string;
  }
}

declare const FourOFourCssModule: FourOFourCssNamespace.IFourOFourCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FourOFourCssNamespace.IFourOFourCss;
};

export = FourOFourCssModule;
