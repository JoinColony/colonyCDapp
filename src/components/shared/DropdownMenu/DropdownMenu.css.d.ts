declare namespace DropdownMenuCssNamespace {
  export interface IDropdownMenuCss {
    baseStyles: string;
    main: string;
    themeDark: string;
  }
}

declare const DropdownMenuCssModule: DropdownMenuCssNamespace.IDropdownMenuCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropdownMenuCssNamespace.IDropdownMenuCss;
};

export = DropdownMenuCssModule;
