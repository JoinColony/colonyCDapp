declare namespace DropdownMenuSeparatorCssNamespace {
  export interface IDropdownMenuSeparatorCss {
    main: string;
  }
}

declare const DropdownMenuSeparatorCssModule: DropdownMenuSeparatorCssNamespace.IDropdownMenuSeparatorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropdownMenuSeparatorCssNamespace.IDropdownMenuSeparatorCss;
};

export = DropdownMenuSeparatorCssModule;
