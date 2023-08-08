export interface RefRegistryEntry {
  element: HTMLElement;
  toggleOff: () => void;
  toggleState: boolean;
}

export type UseToggleReturnType = [
  boolean,
  {
    toggle: () => void;
    toggleOn: () => void;
    toggleOff: () => void;
  },
];
