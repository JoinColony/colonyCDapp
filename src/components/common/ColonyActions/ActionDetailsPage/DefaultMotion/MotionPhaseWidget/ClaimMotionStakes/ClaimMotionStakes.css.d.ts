declare namespace ClaimMotionStakesCssNamespace {
  export interface IClaimMotionStakesCss {
    claimLabel: string;
  }
}

declare const ClaimMotionStakesCssModule: ClaimMotionStakesCssNamespace.IClaimMotionStakesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ClaimMotionStakesCssNamespace.IClaimMotionStakesCss;
};

export = ClaimMotionStakesCssModule;
