declare namespace CustomEndpointInputCssNamespace {
  export interface ICustomEndpointInputCss {
    main: string;
  }
}

declare const CustomEndpointInputCssModule: CustomEndpointInputCssNamespace.ICustomEndpointInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CustomEndpointInputCssNamespace.ICustomEndpointInputCss;
};

export = CustomEndpointInputCssModule;
