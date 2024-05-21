declare module "telegram" {
  // https://core.telegram.org/bots/webapps#initializing-mini-apps
  // @notice: not all fields and methods are covered
  export type WebApp = {
    // https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
    initData: string;
    platform: string;
    version: string;

    // This method is only available for Web Apps launched via a [Keyboard button](https://core.telegram.org/bots/webapps#keyboard-button-web-apps)
    sendData(this: WebApp, data: any): void;
    showAlert(this: WebApp, data: string): void;
    openLink(this: WebApp, link: string, options?: any): void;
    openTelegramLink(this: WebApp, link: string): void;

    expand(): void;
    ready(): void;
    close(): void;
    isVersionAtLeast(version: string): boolean;
    enableClosingConfirmation(): void;
    disableClosingConfirmation(): void;

    onEvent(this: WebApp, eventType: string, handler: EventHandler<"webAppEvent">): void;
    offEvent(this: WebApp, eventType: string, handler: EventHandler<"webAppEvent">): void;

    // components
    BackButton: BackButton;
    MainButton: MainButton;
    SettingsButton: SettingsButton;
    HapticFeedback: any;
    CloudStorage: any;
    BiometricManager: any;

    isExpanded: boolean;
    isClosingConfirmationEnabled: boolean;

    viewportHeight: number;
    viewportStableHeight: number;

    // theme
    colorScheme: string;
    headerColor: string;
    backgroundColor: string;
    themeParams: ThemeParams;
    setHeaderColor(this: WebApp, color: string): void;
    setBackgroundColor(this: WebApp, color: string): void;
  };

  type MainButton = {
    text: string;
    color: string;
    textColor: string;

    isVisible: boolean;
    isActive: boolean;
    isLoading: boolean;
    isProgressVisible: boolean;

    setText(this: MainButton, text: string): void;
    onClick(this: MainButton, callback: EventHandler<"mainButtonClicked">): void;
    offClick(this: MainButton, callback: EventHandler<"mainButtonClicked">): void;

    show(this: MainButton): void;
    hide(this: MainButton): void;
    enable(this: MainButton): void;
    disable(this: MainButton): void;

    showProgress(this: MainButton, leaveActive: boolean = false): void;
    hideProgress(this: MainButton): void;

    setParams(
      this: MainButton,
      params: {
        text?: string;
        color?: string;
        text_color?: string;
        is_visible?: boolean;
        is_active?: boolean;
      },
    ): void;
  };

  type BackButton = {
    isVisible: boolean;

    onClick(this: BackButton, callback: EventHandler<"settingsButtonClicked">): void;
    offClick(this: BackButton, callback: EventHandler<"settingsButtonClicked">): void;

    show(): void;
    hide(): void;
  };

  type SettingsButton = {
    isVisible: boolean;

    onClick(this: SettingsButton, callback: EventHandler<"settingsButtonClicked">): void;
    offClick(this: SettingsButton, callback: EventHandler<"settingsButtonClicked">): void;

    show(): void;
    hide(): void;
  };

  type ThemeParams = {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
}
