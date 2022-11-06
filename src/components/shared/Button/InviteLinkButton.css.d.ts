declare namespace InviteLinkButtonCssNamespace {
  export interface IInviteLinkButtonCss {
    inviteLinkButton: string;
    tooltip: string;
  }
}

declare const InviteLinkButtonCssModule: InviteLinkButtonCssNamespace.IInviteLinkButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InviteLinkButtonCssNamespace.IInviteLinkButtonCss;
};

export = InviteLinkButtonCssModule;
