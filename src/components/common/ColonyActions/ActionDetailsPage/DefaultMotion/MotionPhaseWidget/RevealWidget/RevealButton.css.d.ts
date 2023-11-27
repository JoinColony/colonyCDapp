declare namespace RevealButtonCssNamespace {
  export interface IRevealButtonCss {
    main: string;
  }
}

declare const RevealButtonCssModule: RevealButtonCssNamespace.IRevealButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RevealButtonCssNamespace.IRevealButtonCss;
};

export = RevealButtonCssModule;
