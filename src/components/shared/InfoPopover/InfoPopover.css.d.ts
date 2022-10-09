declare namespace InfoPopoverCssNamespace {
  export interface IInfoPopoverCss {
    addToWallet: string;
    address: string;
    badges: string;
    container: string;
    displayName: string;
    etherscanLink: string;
    main: string;
    nativeTokenMessage: string;
    reputationHeading: string;
    section: string;
    symbol: string;
    textContainer: string;
    userName: string;
  }
}

declare const InfoPopoverCssModule: InfoPopoverCssNamespace.IInfoPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InfoPopoverCssNamespace.IInfoPopoverCss;
};

export = InfoPopoverCssModule;
