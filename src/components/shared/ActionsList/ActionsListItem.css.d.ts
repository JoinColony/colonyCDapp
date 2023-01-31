declare namespace ActionsListItemCssNamespace {
  export interface IActionsListItemCss {
    avatar: string;
    commentCount: string;
    commentCountIcon: string;
    content: string;
    countdownTimerContainer: string;
    day: string;
    domain: string;
    main: string;
    mainTextSize: string;
    meta: string;
    motionTagWrapper: string;
    popoverDistance: string;
    popoverWidth: string;
    separator: string;
    stateNeedAction: string;
    stateNeedAttention: string;
    stateNoPointer: string;
    stateYellow: string;
    status: string;
    title: string;
    titleDecoration: string;
    titleWrapper: string;
    userMention: string;
  }
}

declare const ActionsListItemCssModule: ActionsListItemCssNamespace.IActionsListItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionsListItemCssNamespace.IActionsListItemCss;
};

export = ActionsListItemCssModule;
