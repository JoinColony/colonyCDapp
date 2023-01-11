declare namespace DraftDecisionActionsCssNamespace {
  export interface IDraftDecisionActionsCss {
    buttonContainer: string;
  }
}

declare const DraftDecisionActionsCssModule: DraftDecisionActionsCssNamespace.IDraftDecisionActionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DraftDecisionActionsCssNamespace.IDraftDecisionActionsCss;
};

export = DraftDecisionActionsCssModule;
