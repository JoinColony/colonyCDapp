declare namespace SpecificSidePanelModuleCssNamespace {
  export interface ISpecificSidePanelModuleCss {
    panelData: string;
    panelRow: string;
    panelTitle: string;
  }
}

declare const SpecificSidePanelModuleCssModule: SpecificSidePanelModuleCssNamespace.ISpecificSidePanelModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SpecificSidePanelModuleCssNamespace.ISpecificSidePanelModuleCss;
};

export = SpecificSidePanelModuleCssModule;
