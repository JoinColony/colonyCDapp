import React from 'react';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import Button from '~v5/shared/Button';
import { Appearance, Heading3 } from '~shared/Heading';
import { ComplexMessageValues, SimpleMessageValues } from '~types';
import { multiLineTextEllipsis } from '~utils/strings';

import styles from './shared.css';

export const TruncatedName = (name: string, maxLength = 120) => (
  // Use JS to truncate string here, rather then CSS, to customise string's max length
  <span key={name} className={styles.truncated} title={name}>
    {multiLineTextEllipsis(name, maxLength)}
  </span>
);

interface HeaderRowProps {
  heading: MessageDescriptor | string;
  headingValues?: SimpleMessageValues;
  description: MessageDescriptor;
}

export const HeaderRow = ({
  heading,
  headingValues,
  description,
}: HeaderRowProps) => {
  const { formatMessage } = useIntl();

  const headingText =
    typeof heading === 'string'
      ? heading
      : heading && formatMessage(heading, headingValues);
  const subHeadingText =
    typeof description === 'string'
      ? description
      : description && formatMessage(description);

  return (
    <div className="pb-4 border-b border-gray300 mb-8">
      <h3 className="heading-3">{headingText}</h3>
      <p className="text-sm text-gray-400">{subHeadingText}</p>
    </div>
  );
};

interface ButtonRowProps {
  previousStep: () => boolean;
}

export const ButtonRow = ({ previousStep }: ButtonRowProps) => {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();

  const disabled = !isValid || isSubmitting;
  const loading = isSubmitting;

  return (
    <div className="pt-12 flex justify-between">
      <Button
        text={{ id: 'button.back' }}
        textValues={{ loading: 'test' }}
        onClick={previousStep}
        loading={loading}
        mode="primaryOutline"
      />
      <Button
        text={{ id: 'button.continue' }}
        type="submit"
        disabled={disabled}
        loading={loading}
        mode="solidBlack"
      />
    </div>
  );
};

interface HeadingTextProps {
  text: MessageDescriptor;
  textValues?: ComplexMessageValues;
  paragraph: MessageDescriptor;
  appearance: Partial<Appearance>;
}

export const HeadingText = ({
  text,
  textValues,
  paragraph,
  appearance,
}: HeadingTextProps) => (
  <>
    <Heading3 appearance={appearance} text={text} textValues={textValues} />
    <p className={styles.paragraph}>
      <FormattedMessage {...paragraph} />
    </p>
  </>
);
