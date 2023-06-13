import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Button from '~shared/Button';
import { Appearance, Heading3 } from '~shared/Heading';
import { ComplexMessageValues } from '~types';
import { multiLineTextEllipsis } from '~utils/strings';

import styles from './shared.css';

export const TruncatedName = (name: string, maxLength = 120) => (
  // Use JS to truncate string here, rather then CSS, to customise string's max length
  <span key={name} className={styles.truncated} title={name}>
    {multiLineTextEllipsis(name, maxLength)}
  </span>
);

interface SubmitFormButtonProps {
  disabled: boolean;
  loading: boolean;
  dataTest: string;
  className?: string;
}

export const SubmitFormButton = ({
  disabled,
  loading,
  dataTest,
  className,
}: SubmitFormButtonProps) => (
  <div className={className || styles.submitButton}>
    <Button
      appearance={{ theme: 'primary', size: 'large' }}
      text={{ id: 'button.continue' }}
      type="submit"
      data-test={dataTest}
      disabled={disabled}
      loading={loading}
    />
  </div>
);

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
