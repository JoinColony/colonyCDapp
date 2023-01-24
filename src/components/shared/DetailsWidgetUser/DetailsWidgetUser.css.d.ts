declare namespace DetailsWidgetUserCssNamespace {
  export interface IDetailsWidgetUserCss {
    address: string;
    main: string;
    textContainer: string;
    username: string;
  }
}

declare const DetailsWidgetUserCssModule: DetailsWidgetUserCssNamespace.IDetailsWidgetUserCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DetailsWidgetUserCssNamespace.IDetailsWidgetUserCss;
};

export = DetailsWidgetUserCssModule;
