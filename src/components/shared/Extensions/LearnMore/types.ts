import { type MessageDescriptor } from 'react-intl';

import { type TypedMessageDescriptor } from '~types';

export interface LearnMoreProps {
  message: TypedMessageDescriptor | MessageDescriptor;
  href: string;
}
