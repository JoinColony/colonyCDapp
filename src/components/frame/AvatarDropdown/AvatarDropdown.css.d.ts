declare namespace AvatarDropdownCssNamespace {
  export interface IAvatarDropdownCss {
    activeDropdown: string;
    avatarButton: string;
    horizontalOffset: string;
    refWidth: string;
    verticalOffset: string;
  }
}

declare const AvatarDropdownCssModule: AvatarDropdownCssNamespace.IAvatarDropdownCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarDropdownCssNamespace.IAvatarDropdownCss;
};

export = AvatarDropdownCssModule;
