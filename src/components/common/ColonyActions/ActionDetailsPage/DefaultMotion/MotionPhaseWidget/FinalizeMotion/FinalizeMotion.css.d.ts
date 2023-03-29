declare namespace FinalizeMotionCssNamespace {
  export interface IFinalizeMotionCss {
    finalizeError: string;
    loading: string;
  }
}

declare const FinalizeMotionCssModule: FinalizeMotionCssNamespace.IFinalizeMotionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FinalizeMotionCssNamespace.IFinalizeMotionCss;
};

export = FinalizeMotionCssModule;
