declare namespace MotionDomainSelectCssNamespace {
  export interface IMotionDomainSelectCss {
    activeItem: string;
    main: string;
  }
}

declare const MotionDomainSelectCssModule: MotionDomainSelectCssNamespace.IMotionDomainSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MotionDomainSelectCssNamespace.IMotionDomainSelectCss;
};

export = MotionDomainSelectCssModule;
