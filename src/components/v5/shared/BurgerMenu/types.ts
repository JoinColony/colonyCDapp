export interface BurgerMenuProps {
  isVertical?: boolean;
  setTriggerRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  className?: string;
}
