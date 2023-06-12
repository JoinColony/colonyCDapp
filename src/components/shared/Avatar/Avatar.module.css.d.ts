declare namespace AvatarModuleCssNamespace {
  export interface IAvatarModuleCss {
    highlighted: string;
    image: string;
    l: string;
    m: string;
    main: string;
    placeholderIcon: string;
    placeholderIconNotSet: string;
    s: string;
    sm: string;
    xl: string;
    xs: string;
    xxs: string;
    xxxs: string;
  }
}

declare const AvatarModuleCssModule: AvatarModuleCssNamespace.IAvatarModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarModuleCssNamespace.IAvatarModuleCss;
};

export = AvatarModuleCssModule;
