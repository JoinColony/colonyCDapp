declare namespace SafeListItemCssNamespace {
  export interface ISafeListItemCss {
    address: string;
    avatar: string;
    checkbox: string;
    checked: string;
    label: string;
    main: string;
    selectedLabel: string;
  }
}

declare const SafeListItemCssModule: SafeListItemCssNamespace.ISafeListItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeListItemCssNamespace.ISafeListItemCss;
};

export = SafeListItemCssModule;
