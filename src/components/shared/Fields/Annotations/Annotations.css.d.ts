declare namespace AnnotationsCssNamespace {
  export interface IAnnotationsCss {
    container: string;
  }
}

declare const AnnotationsCssModule: AnnotationsCssNamespace.IAnnotationsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AnnotationsCssNamespace.IAnnotationsCss;
};

export = AnnotationsCssModule;
