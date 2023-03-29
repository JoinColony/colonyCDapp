declare namespace MembersFilterCssNamespace {
  export interface IMembersFilterCss {
    divider: string;
    filters: string;
    title: string;
    titleContainer: string;
  }
}

declare const MembersFilterCssModule: MembersFilterCssNamespace.IMembersFilterCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersFilterCssNamespace.IMembersFilterCss;
};

export = MembersFilterCssModule;
