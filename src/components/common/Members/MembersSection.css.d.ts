declare namespace MembersSectionCssNamespace {
  export interface IMembersSectionCss {
    bar: string;
    contributorsTitle: string;
    description: string;
    mappings: string;
    membersList: string;
    names: string;
    noResults: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    title: string;
    version: string;
  }
}

declare const MembersSectionCssModule: MembersSectionCssNamespace.IMembersSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersSectionCssNamespace.IMembersSectionCss;
};

export = MembersSectionCssModule;
