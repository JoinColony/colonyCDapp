declare namespace AvatarDropdownPopoverCssNamespace {
  export interface IAvatarDropdownPopoverCss {
    externalLink: string;
  }
}

declare const AvatarDropdownPopoverCssModule: AvatarDropdownPopoverCssNamespace.IAvatarDropdownPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarDropdownPopoverCssNamespace.IAvatarDropdownPopoverCss;
};

export = AvatarDropdownPopoverCssModule;
