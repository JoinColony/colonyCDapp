declare namespace ColonySafesCssNamespace {
  export interface IColonySafesCss {
    main: string;
    safeItem: string;
    safeItemButton: string;
    safeItemToggledButton: string;
  }
}

declare const ColonySafesCssModule: ColonySafesCssNamespace.IColonySafesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonySafesCssNamespace.IColonySafesCss;
};

export = ColonySafesCssModule;
