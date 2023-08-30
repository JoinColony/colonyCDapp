import { InferType } from 'yup';
import { ExternalLinks } from '~gql';
import { FormProps } from '~shared/Fields/Form/Form';
import { ModalProps } from '~v5/shared/Modal/types';

import { SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA } from './consts';

export type SocialLinkModalFormValues = InferType<
  typeof SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA
>;

export interface SocialLinkFormModalProps extends ModalProps {
  onSubmit: FormProps<SocialLinkModalFormValues>['onSubmit'];
  initialLinkType?: ExternalLinks;
  defaultValues: Partial<SocialLinkModalFormValues>[];
}
