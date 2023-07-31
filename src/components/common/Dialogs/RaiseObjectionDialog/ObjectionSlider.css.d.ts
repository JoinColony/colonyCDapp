declare namespace ObjectionSliderCssNamespace {
  export interface IObjectionSliderCss {
    main: string;
  }
}

declare const ObjectionSliderCssModule: ObjectionSliderCssNamespace.IObjectionSliderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ObjectionSliderCssNamespace.IObjectionSliderCss;
};

export = ObjectionSliderCssModule;
