declare namespace Intercom_ {
  interface IntercomSettings {
    // Messenger attributes
    app_id?: string | undefined;
    api_base?: string | undefined;
    alignment?: string | undefined;
    custom_launcher_selector?: string | undefined;
    hide_default_launcher?: boolean | undefined;
    horizontal_padding?: number | undefined;
    session_duration?: number | undefined;
    vertical_padding?: number | undefined;
    action_color?: string | undefined;
    background_color?: string | undefined;

    // Data attributes
    email?: string | undefined;
    phone?: string | undefined;
    created_at?: number | undefined;
    name?: string | undefined;
    user_id?: string | undefined;
    user_hash?: string | undefined;
    unsubscribed_from_emails?: boolean | undefined;
    language_override?: string | undefined;
    utm_campaign?: string | undefined;
    utm_content?: string | undefined;
    utm_medium?: string | undefined;
    utm_source?: string | undefined;
    utm_term?: string | undefined;
    company?: IntercomCompany | undefined;
    companies?: IntercomCompany[] | undefined;
    avatar?: IntercomAvatar | undefined;

    // Custom attributes
    [custom_attribute: string]:
      | IntercomCompany
      | IntercomCompany[]
      | IntercomAvatar
      | IntercomCustomAttribute;
  }

  interface IntercomCommandSignature {
    boot: (settings: IntercomSettings) => void;
    shutdown: () => void;
    update: (settings?: IntercomSettings) => void;
    hide: () => void;
    show: () => void;
    showMessages: () => void;
    showNewMessage: (prepopulateMessage?: string) => void;
    onHide: (callback: () => void) => void;
    onShow: (callback: () => void) => void;
    onUnreadCountChange: (callback: (unreadCount: number) => void) => void;
    onActivatorClick: (callback: () => void) => void;
    trackEvent: (tag?: string, metadata?: any) => void;
    getVisitorId: () => string;
    startTour: (tourId: number) => void;
    showArticle: (articleId: number) => void;
    showConversation: (conversationId: number) => void;
    startSurvey: (surveyId: number) => void;
    reattach_activator: () => void;
    showSpace: (space: string) => void;
    startChecklist: (checklistId: number) => void;
  }

  type IntercomCommand = keyof IntercomCommandSignature;

  interface IntercomStatic {
    <Command extends IntercomCommand>(
      command: Command,
      ...params: Parameters<IntercomCommandSignature[Command]>
    ): ReturnType<IntercomCommandSignature[Command]>;
    booted: boolean;
  }

  interface IntercomCompany {
    name: string;
    id?: string | number | undefined;
    company_id?: string | number | undefined;
    created_at?: number | undefined;
    remote_created_at?: number | undefined;
    plan?: string | undefined;
    monthly_spend?: number | undefined;
    user_count?: number | undefined;
    size?: number | undefined;
    website?: string | undefined;
    industry?: string | undefined;
    [custom_attribute: string]: IntercomCustomAttribute;
  }

  interface IntercomAvatar {
    type: 'avatar';
    image_url: string;
  }

  type IntercomCustomAttribute = string | number | boolean | null | undefined;
}

declare let Intercom: Intercom_.IntercomStatic;
declare let intercomSettings: Intercom_.IntercomSettings | undefined;

interface Window {
  Intercom: Intercom_.IntercomStatic;
  intercomSettings?: Intercom_.IntercomSettings | undefined;
}
