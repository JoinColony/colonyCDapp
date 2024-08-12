import React from 'react';

import { formatText } from '~utils/intl.ts';

import { type ModalHeadingProps } from './types.ts';

const displayName = 'v5.pages.userCryptoToFiatPage.partials.ModalHeading';

const ModalHeading: React.FC<ModalHeadingProps> = ({ title, subtitle }) => (
  <section className="mb-6 flex flex-col gap-1.5">
    <h4 className="heading-5">{formatText(title)}</h4>
    <p className="text-md font-normal text-gray-600">{formatText(subtitle)}</p>
  </section>
);

ModalHeading.displayName = displayName;

export default ModalHeading;
