declare namespace PopoverWrapperCssNamespace {
  export interface IPopoverWrapperCss {
    arrow: string;
    arrowBorder: string;
    arrowHorizontalEnd: string;
    arrowHorizontalStart: string;
    arrowSize: string;
    arrowVerticalEnd: string;
    arrowVerticalStart: string;
    backgroundColor: string;
    bottomArrow: string;
    bottomEndArrow: string;
    bottomStartArrow: string;
    leftArrow: string;
    leftEndArrow: string;
    leftStartArrow: string;
    main: string;
    rightArrow: string;
    rightEndArrow: string;
    rightStartArrow: string;
    sizeMedium: string;
    stateHideArrow: string;
    stateShowArrow: string;
    themeDark: string;
    themeDarkBackgroundColor: string;
    themeDarkBottomArrow: string;
    themeDarkBottomEndArrow: string;
    themeDarkBottomStartArrow: string;
    themeDarkLeftArrow: string;
    themeDarkLeftEndArrow: string;
    themeDarkLeftStartArrow: string;
    themeDarkRightArrow: string;
    themeDarkRightEndArrow: string;
    themeDarkRightStartArrow: string;
    themeDarkTopArrow: string;
    themeDarkTopEndArrow: string;
    themeDarkTopStartArrow: string;
    themeGrey: string;
    themeGreyBackgroundColor: string;
    themeGreyBottomArrow: string;
    themeGreyBottomEndArrow: string;
    themeGreyBottomStartArrow: string;
    themeGreyLeftArrow: string;
    themeGreyLeftEndArrow: string;
    themeGreyLeftStartArrow: string;
    themeGreyRightArrow: string;
    themeGreyRightEndArrow: string;
    themeGreyRightStartArrow: string;
    themeGreyTopArrow: string;
    themeGreyTopEndArrow: string;
    themeGreyTopStartArrow: string;
    topArrow: string;
    topEndArrow: string;
    topStartArrow: string;
  }
}

declare const PopoverWrapperCssModule: PopoverWrapperCssNamespace.IPopoverWrapperCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PopoverWrapperCssNamespace.IPopoverWrapperCss;
};

export = PopoverWrapperCssModule;
