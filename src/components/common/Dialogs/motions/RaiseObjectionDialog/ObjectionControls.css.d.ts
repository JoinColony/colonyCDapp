declare namespace ObjectionControlsCssNamespace {
  export interface IObjectionControlsCss {
    submitButton: string;
  }
}

declare const ObjectionControlsCssModule: ObjectionControlsCssNamespace.IObjectionControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ObjectionControlsCssNamespace.IObjectionControlsCss;
};

export = ObjectionControlsCssModule;
