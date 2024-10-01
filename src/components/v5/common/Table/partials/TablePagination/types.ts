export interface TablePaginationProps {
  onNextClick: () => void;
  onPrevClick: () => void;
  pageNumberLabel?: string;
  canGoToPreviousPage?: boolean;
  canGoToNextPage?: boolean;
  disabled?: boolean;
}
