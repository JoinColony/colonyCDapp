declare namespace DropdownMenuSectionCssNamespace {
  export interface IDropdownMenuSectionCss {
    separator: string;
  }
}

declare const DropdownMenuSectionCssModule: DropdownMenuSectionCssNamespace.IDropdownMenuSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropdownMenuSectionCssNamespace.IDropdownMenuSectionCss;
};

export = DropdownMenuSectionCssModule;
