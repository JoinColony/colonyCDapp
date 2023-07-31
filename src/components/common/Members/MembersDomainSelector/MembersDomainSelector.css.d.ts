declare namespace MembersDomainSelectorCssNamespace {
  export interface IMembersDomainSelectorCss {
    titleSelect: string;
  }
}

declare const MembersDomainSelectorCssModule: MembersDomainSelectorCssNamespace.IMembersDomainSelectorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersDomainSelectorCssNamespace.IMembersDomainSelectorCss;
};

export = MembersDomainSelectorCssModule;
