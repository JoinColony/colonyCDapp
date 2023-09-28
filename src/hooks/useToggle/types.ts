export type ShouldCloseCallback = (element: Element) => boolean;
export type OnBeforeCloseCallback = (element: Element) => void | false;

export interface RefRegistryEntry {
  element: HTMLElement;
  toggleOff: () => void;
  toggleState: boolean;
  shouldCloseCallbackRef: React.MutableRefObject<
    ShouldCloseCallback | undefined
  >;
  onBeforeCloseCallbacksRef: React.MutableRefObject<OnBeforeCloseCallback[]>;
}

export type UseToggleReturnType = [
  boolean,
  {
    toggle: () => void;
    toggleOn: () => void;
    toggleOff: () => void;
    registerContainerRef: (ref: HTMLElement | null) => void;
    useRegisterOnBeforeCloseCallback: (callback: OnBeforeCloseCallback) => void;
  },
];
