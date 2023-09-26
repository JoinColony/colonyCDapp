export type ShouldCloseCallback = (element: Element) => boolean;

export interface RefRegistryEntry {
  element: HTMLElement;
  toggleOff: () => void;
  toggleState: boolean;
  shouldCloseCallbackRef: React.MutableRefObject<
    ShouldCloseCallback | undefined
  >;
}

export type UseToggleReturnType = [
  boolean,
  {
    toggle: () => void;
    toggleOn: () => void;
    toggleOff: () => void;
    registerContainerRef: (ref: HTMLElement | null) => void;
  },
];
