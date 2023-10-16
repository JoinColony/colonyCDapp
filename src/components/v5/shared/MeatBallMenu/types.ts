export interface RenderMeatBallItemWrapperProps {
  className?: string;
  onClick?: () => void;
}

export type RenderMeatBallItemWrapper = (
  props: RenderMeatBallItemWrapperProps,
  children: React.ReactNode,
) => React.ReactNode;

export interface MeatBallMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void | boolean;
  renderItemWrapper?: RenderMeatBallItemWrapper;
  className?: string;
}

export interface MeatBallMenuProps {
  disabled?: boolean;
  items: MeatBallMenuItem[];
  buttonClassName?: string;
  contentWrapperClassName?: string;
  className?: string;
  renderItemWrapper?: RenderMeatBallItemWrapper;
  withVerticalIcon?: boolean;
  onSelect?: () => void;
}
