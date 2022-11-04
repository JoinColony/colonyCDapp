declare namespace GroupedTransactionCardCssNamespace {
  export interface IGroupedTransactionCardCss {
    button: string;
    cancelButton: string;
    cancelDecision: string;
    confirmationButton: string;
    description: string;
    failedDescription: string;
    main: string;
    stateFailed: string;
    stateIsShowingCancelConfirmation: string;
    stateSelected: string;
    stateSucceeded: string;
  }
}

declare const GroupedTransactionCardCssModule: GroupedTransactionCardCssNamespace.IGroupedTransactionCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GroupedTransactionCardCssNamespace.IGroupedTransactionCardCss;
};

export = GroupedTransactionCardCssModule;
