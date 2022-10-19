declare namespace DropdownMenuItemCssNamespace {
  export interface IDropdownMenuItemCss {
    main: string;
  }
}

declare const DropdownMenuItemCssModule: DropdownMenuItemCssNamespace.IDropdownMenuItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropdownMenuItemCssNamespace.IDropdownMenuItemCss;
};

export = DropdownMenuItemCssModule;
