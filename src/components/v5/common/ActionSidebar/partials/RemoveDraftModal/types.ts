import { type ModalBaseProps } from '~v5/shared/Modal/types.ts';

export interface RemoveDraftModalProps extends Pick<ModalBaseProps, 'isOpen'> {
  onViewDraftClick?: () => void;
  onCreateNewClick?: () => void;
  onCloseClick: () => void;
}
