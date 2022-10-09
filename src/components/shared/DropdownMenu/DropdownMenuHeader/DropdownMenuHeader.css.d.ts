declare namespace DropdownMenuHeaderCssNamespace {
  export interface IDropdownMenuHeaderCss {
    main: string;
  }
}

declare const DropdownMenuHeaderCssModule: DropdownMenuHeaderCssNamespace.IDropdownMenuHeaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropdownMenuHeaderCssNamespace.IDropdownMenuHeaderCss;
};

export = DropdownMenuHeaderCssModule;
