declare namespace MemberActionsPopoverCssNamespace {
  export interface IMemberActionsPopoverCss {
    actionButton: string;
    query428: string;
  }
}

declare const MemberActionsPopoverCssModule: MemberActionsPopoverCssNamespace.IMemberActionsPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MemberActionsPopoverCssNamespace.IMemberActionsPopoverCss;
};

export = MemberActionsPopoverCssModule;
