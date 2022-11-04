declare namespace MessageCardCssNamespace {
  export interface IMessageCardCss {
    button: string;
    description: string;
    main: string;
    summary: string;
  }
}

declare const MessageCardCssModule: MessageCardCssNamespace.IMessageCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MessageCardCssNamespace.IMessageCardCss;
};

export = MessageCardCssModule;
