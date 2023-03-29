declare namespace ThreeDotsButtonCssNamespace {
  export interface IThreeDotsButtonCss {
    icon: string;
    main: string;
    menuActive: string;
  }
}

declare const ThreeDotsButtonCssModule: ThreeDotsButtonCssNamespace.IThreeDotsButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ThreeDotsButtonCssNamespace.IThreeDotsButtonCss;
};

export = ThreeDotsButtonCssModule;
