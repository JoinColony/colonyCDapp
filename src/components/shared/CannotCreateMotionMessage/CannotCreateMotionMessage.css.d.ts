declare namespace CannotCreateMotionMessageCssNamespace {
  export interface ICannotCreateMotionMessageCss {
    cannotCreateMotionMessage: string;
  }
}

declare const CannotCreateMotionMessageCssModule: CannotCreateMotionMessageCssNamespace.ICannotCreateMotionMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CannotCreateMotionMessageCssNamespace.ICannotCreateMotionMessageCss;
};

export = CannotCreateMotionMessageCssModule;
