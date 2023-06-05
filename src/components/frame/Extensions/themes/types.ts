export interface ITheme {
  [key: string]: string;
}

export interface IThemesList {
  [key: string]: ITheme;
}

export interface IMappedTheme {
  [key: string]: string | null;
}
