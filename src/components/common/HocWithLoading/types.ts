export interface HocWithLoadingProps {
  isLoading?: boolean;
  skeletonFrame: {
    // in pixels
    height: number;
    // in pixels
    width: number;
    // in pixels
    borderRadius?: number;
  };
  containerClassName?: string;
}
