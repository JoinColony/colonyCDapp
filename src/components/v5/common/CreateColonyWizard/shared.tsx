import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import Button from '~v5/shared/Button';
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

export const ButtonRow = () => {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();

  const disabled = !isValid || isSubmitting;
  const loading = isSubmitting;

  /* const customHandler = useCallback(() => previousStep(), [previousStep]); */

  return (
    <div className="pt-12 flex justify-between">
      <Button
        text={{ id: 'button.back' }}
        type="submit"
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
