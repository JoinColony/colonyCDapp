declare namespace AnnotationCssNamespace {
  export interface IAnnotationCss {
    avatar: string;
    content: string;
    details: string;
    main: string;
    text: string;
    username: string;
  }
}

declare const AnnotationCssModule: AnnotationCssNamespace.IAnnotationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AnnotationCssNamespace.IAnnotationCss;
};

export = AnnotationCssModule;
