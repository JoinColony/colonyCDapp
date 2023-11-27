declare namespace TotalStakeRadiosCssNamespace {
  export interface ITotalStakeRadiosCss {
    main: string;
  }
}

declare const TotalStakeRadiosCssModule: TotalStakeRadiosCssNamespace.ITotalStakeRadiosCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TotalStakeRadiosCssNamespace.ITotalStakeRadiosCss;
};

export = TotalStakeRadiosCssModule;
