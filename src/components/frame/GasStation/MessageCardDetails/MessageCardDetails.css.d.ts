declare namespace MessageCardDetailsCssNamespace {
  export interface IMessageCardDetailsCss {
    button: string;
    cancelButton: string;
    cancelDecision: string;
    confirmationButton: string;
    confirmationButtonsWrapper: string;
    description: string;
    main: string;
    stateFailed: string;
    stateIsShowingCancelConfirmation: string;
    stateSucceeded: string;
    summary: string;
    themeMessage: string;
    title: string;
  }
}

declare const MessageCardDetailsCssModule: MessageCardDetailsCssNamespace.IMessageCardDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MessageCardDetailsCssNamespace.IMessageCardDetailsCss;
};

export = MessageCardDetailsCssModule;
