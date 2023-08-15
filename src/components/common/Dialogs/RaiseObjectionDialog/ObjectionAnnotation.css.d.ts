declare namespace ObjectionAnnotationCssNamespace {
  export interface IObjectionAnnotationCss {
    editor: string;
  }
}

declare const ObjectionAnnotationCssModule: ObjectionAnnotationCssNamespace.IObjectionAnnotationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ObjectionAnnotationCssNamespace.IObjectionAnnotationCss;
};

export = ObjectionAnnotationCssModule;
