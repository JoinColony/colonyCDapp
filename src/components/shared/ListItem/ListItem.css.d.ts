declare namespace ListItemCssNamespace {
  export interface IListItemCss {
    avatar: string;
    content: string;
    day: string;
    main: string;
    mainTextSize: string;
    meta: string;
    motionTagWrapper: string;
    stateDraft: string;
    stateNeedAction: string;
    stateNeedAttention: string;
    stateNoPointer: string;
    status: string;
    title: string;
    titleDecoration: string;
    titleWrapper: string;
  }
}

declare const ListItemCssModule: ListItemCssNamespace.IListItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ListItemCssNamespace.IListItemCss;
};

export = ListItemCssModule;
