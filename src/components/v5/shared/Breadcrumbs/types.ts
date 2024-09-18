export type BreadcrumbsItem = { key: string } & {
  label: string;
  href?: string;
};

export interface BreadcrumbsProps {
  className?: string;
}
