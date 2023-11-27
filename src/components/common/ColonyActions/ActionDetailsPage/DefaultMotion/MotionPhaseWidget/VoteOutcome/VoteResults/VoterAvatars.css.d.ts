declare namespace VoterAvatarsCssNamespace {
  export interface IVoterAvatarsCss {
    main: string;
    remaningAvatars: string;
    voterAvatar: string;
    voterAvatars: string;
  }
}

declare const VoterAvatarsCssModule: VoterAvatarsCssNamespace.IVoterAvatarsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VoterAvatarsCssNamespace.IVoterAvatarsCss;
};

export = VoterAvatarsCssModule;
