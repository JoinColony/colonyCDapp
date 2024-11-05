export enum TourTargets {
  // General
  NoTarget = 'body',
  MainMenu = 'mainMenu',
  ActionsMenu = 'actionsMenu',
  UserMenu = 'userMenu',
  Breadcrumbs = 'breadcrumbs',
  HelpAndFeedback = 'helpAndFeedback',

  // Action Panel
  ActionsPanel = 'actionPanel',
  EnterTitleField = 'actionEnterTitle',
  ChooseActionButton = 'actionChooseAction',
  SelectActionButton = 'actionSelectAction',
  DecisionMethodField = 'createActionDecisionMethod',
  ActionDescriptionField = 'createActionActionDescription',
  CancelActionButton = 'createActionCancelAction',
  CreateActionButton = 'createActionCreateAction',

  // Action Types
  CreateSimplePayment = 'createActionSimplePayment',
  CreateEditColony = 'createActionEditColony',

  // Get started tour targets
  WelcomeButton = 'getStartedWelcome',
  CustomizeColonyFields = 'getStartedCustomizeColony',
  SelectLogoField = 'getStartedSelectLogo',
  EnterDescriptionField = 'getStartedEnterDescription',
  SelectDecisionMethod = 'getStartedSelectDecisionMethod',
  ConfirmActionButton = 'getStartedConfirmAction',

  // Create action tour targets
  ActionOverviewSection = 'createActionOverview',
  CompleteDetailsSection = 'createActionCompleteDetails',

  // Dashboard tour targets
  Dashboard = 'dashboard',
  DashboardOverviewSection = 'dashboardOverview',
  DashboardNativeTokenSection = 'dashboardNativeToken',
  DashboardTeamFilter = 'dashboardTeamFilter',
  DashboardFundsSection = 'dashboardFunds',
  DashboardFinancesSection = 'dashboardFinances',
  DashboardReputationSection = 'dashboardReputation',
  DashboardActivitySection = 'dashboardActivity',
}
