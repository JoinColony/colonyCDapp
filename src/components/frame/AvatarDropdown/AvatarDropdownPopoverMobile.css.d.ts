declare namespace AvatarDropdownPopoverMobileCssNamespace {
  export interface IAvatarDropdownPopoverMobileCss {
    buttonContainer: string;
    itemChild: string;
    itemContainer: string;
    walletAutoLogin: string;
  }
}

declare const AvatarDropdownPopoverMobileCssModule: AvatarDropdownPopoverMobileCssNamespace.IAvatarDropdownPopoverMobileCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarDropdownPopoverMobileCssNamespace.IAvatarDropdownPopoverMobileCss;
};

export = AvatarDropdownPopoverMobileCssModule;
