declare namespace AvatarDropdownCssNamespace {
  export interface IAvatarDropdownCss {
    activeDropdown: string;
    avatarButton: string;
    horizontalOffset: string;
    mappings: string;
    names: string;
    query850: string;
    refWidth: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
    verticalOffset: string;
  }
}

declare const AvatarDropdownCssModule: AvatarDropdownCssNamespace.IAvatarDropdownCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarDropdownCssNamespace.IAvatarDropdownCss;
};

export = AvatarDropdownCssModule;
