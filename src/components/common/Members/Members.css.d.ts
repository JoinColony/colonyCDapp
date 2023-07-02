declare namespace MembersCssNamespace {
  export interface IMembersCss {
    main: string;
    mappings: string;
    names: string;
    noResults: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tableBody: string;
    version: string;
  }
}

declare const MembersCssModule: MembersCssNamespace.IMembersCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersCssNamespace.IMembersCss;
};

export = MembersCssModule;
