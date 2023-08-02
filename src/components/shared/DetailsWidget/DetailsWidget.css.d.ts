declare namespace DetailsWidgetCssNamespace {
  export interface IDetailsWidgetCss {
    address: string;
    descriptionValue: string;
    domainDescription: string;
    domainDescriptionItem: string;
    item: string;
    label: string;
    roleSettingItem: string;
    text: string;
    tokenContainer: string;
    transactionHashLink: string;
    value: string;
  }
}

declare const DetailsWidgetCssModule: DetailsWidgetCssNamespace.IDetailsWidgetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DetailsWidgetCssNamespace.IDetailsWidgetCss;
};

export = DetailsWidgetCssModule;
