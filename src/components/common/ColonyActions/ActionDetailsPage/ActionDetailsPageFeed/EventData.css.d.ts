declare namespace EventDataCssNamespace {
  export interface IEventDataCss {
    content: string;
    details: string;
    text: string;
  }
}

declare const EventDataCssModule: EventDataCssNamespace.IEventDataCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EventDataCssNamespace.IEventDataCss;
};

export = EventDataCssModule;
