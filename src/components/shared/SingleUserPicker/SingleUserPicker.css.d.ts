declare namespace SingleUserPickerCssNamespace {
  export interface ISingleUserPickerCss {
    arrowIcon: string;
    arrowIconActive: string;
    avatarContainer: string;
    baseInput: string;
    container: string;
    directionHorizontal: string;
    errorHorizontal: string;
    focusIcon: string;
    icon: string;
    input: string;
    inputContainer: string;
    inputInvalid: string;
    labelWrap: string;
    main: string;
    omniContainer: string;
    omniPickerContainer: string;
    recipientName: string;
    widthWide: string;
  }
}

declare const SingleUserPickerCssModule: SingleUserPickerCssNamespace.ISingleUserPickerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SingleUserPickerCssNamespace.ISingleUserPickerCss;
};

export = SingleUserPickerCssModule;
