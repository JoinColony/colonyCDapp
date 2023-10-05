export type OnBeforeCloseCallback = (element: Element) => void | false;

export interface RefRegistryEntry {
  element: HTMLElement;
  toggleOff: () => void;
  toggleState: boolean;
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
