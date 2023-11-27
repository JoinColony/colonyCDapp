export interface AccordionItemProps {
  title: React.ReactNode;
  isOpen: boolean;
  onToggle: VoidFunction;
  iconName?: string;
  className?: string;
}
