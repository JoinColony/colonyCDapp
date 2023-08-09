declare namespace ActionAnnotationCssNamespace {
  export interface IActionAnnotationCss {
    avatar: string;
    content: string;
    details: string;
    main: string;
    stateIsObjection: string;
    text: string;
    username: string;
  }
}

declare const ActionAnnotationCssModule: ActionAnnotationCssNamespace.IActionAnnotationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionAnnotationCssNamespace.IActionAnnotationCss;
};

export = ActionAnnotationCssModule;
