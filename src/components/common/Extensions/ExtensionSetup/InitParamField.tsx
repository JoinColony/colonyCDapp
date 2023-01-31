import { useFormikContext } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Input } from '~shared/Fields';
import { ExtensionInitParam, ExtensionParamType } from '~types';

import styles from './ExtensionSetup.css';

const displayName = 'common.Extensions.ExtensionSetup.InitParamField';

const MSG = defineMessages({
  hours: {
    id: `${displayName}.hours`,
    defaultMessage: 'hours',
  },
  periods: {
    id: `${displayName}.periods`,
    defaultMessage: 'periods',
  },
  percent: {
    id: `${displayName}.percent`,
    defaultMessage: '%',
  },
});

const DescriptionChunks = (chunks: React.ReactNode[]) => (
  <span className={styles.descriptionExample}>{chunks}</span>
);

interface Props {
  param: ExtensionInitParam;
}

const InitParamField = ({
  param: {
    title,
    type,
    paramName,
    description,
    complementaryLabel,
    formattingOptions,
  },
}: Props) => {
  const { isSubmitting } = useFormikContext();

  if (type === ExtensionParamType.Input) {
    return (
      <div className={styles.input}>
        <Input
          appearance={{ size: 'medium', theme: 'minimal' }}
          label={title}
          name={paramName}
          disabled={isSubmitting}
          formattingOptions={formattingOptions}
        />
        <p className={styles.inputsDescription}>
          <FormattedMessage
            {...description}
            values={{
              span: DescriptionChunks,
            }}
          />
        </p>
        {complementaryLabel && (
          <span className={styles.complementaryLabel}>
            <FormattedMessage {...MSG[complementaryLabel]} />
          </span>
        )}
      </div>
    );
  }

  return null;
};

InitParamField.displayName = displayName;

export default InitParamField;
