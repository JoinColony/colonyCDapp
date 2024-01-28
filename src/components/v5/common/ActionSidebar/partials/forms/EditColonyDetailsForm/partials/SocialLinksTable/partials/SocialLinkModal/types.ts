import { type InferType } from 'yup';

import { type ExternalLink, type ExternalLinks } from '~gql';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

import { type SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA } from './consts.tsx';

export type SocialLinkModalFormValues = InferType<
  typeof SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA
>;

export interface SocialLinkFormModalProps extends ModalProps {
  onSubmit: (link: ExternalLink) => void;
  initialLinkType?: ExternalLinks;
  defaultValues: Partial<SocialLinkModalFormValues>[];
}
