declare namespace DecisionContentCssNamespace {
  export interface IDecisionContentCss {
    descriptionContainer: string;
    main: string;
    meta: string;
    nameAndTime: string;
    noContent: string;
    stateIsObjection: string;
    userName: string;
    userinfo: string;
  }
}

declare const DecisionContentCssModule: DecisionContentCssNamespace.IDecisionContentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionContentCssNamespace.IDecisionContentCss;
};

export = DecisionContentCssModule;
