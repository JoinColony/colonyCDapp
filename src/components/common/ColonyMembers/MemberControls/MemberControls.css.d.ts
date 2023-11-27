declare namespace MemberControlsCssNamespace {
  export interface IMemberControlsCss {
    controls: string;
  }
}

declare const MemberControlsCssModule: MemberControlsCssNamespace.IMemberControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MemberControlsCssNamespace.IMemberControlsCss;
};

export = MemberControlsCssModule;
