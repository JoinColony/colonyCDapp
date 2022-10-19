declare namespace AvatarCssNamespace {
  export interface IAvatarCss {
    highlighted: string;
    image: string;
    l: string;
    m: string;
    main: string;
    placeholderIcon: string;
    placeholderIconNotSet: string;
    s: string;
    xl: string;
    xs: string;
    xxs: string;
  }
}

declare const AvatarCssModule: AvatarCssNamespace.IAvatarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarCssNamespace.IAvatarCss;
};

export = AvatarCssModule;
