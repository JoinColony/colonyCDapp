import { InferType } from 'yup';

import { ExternalLink, ExternalLinks } from '~gql';
import { ModalProps } from '~v5/shared/Modal/types';

import { SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA } from './consts';

export type SocialLinkModalFormValues = InferType<
  typeof SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA
>;

export interface SocialLinkFormModalProps extends ModalProps {
  onSubmit: (link: ExternalLink) => void;
  initialLinkType?: ExternalLinks;
  defaultValues: Partial<SocialLinkModalFormValues>[];
}
