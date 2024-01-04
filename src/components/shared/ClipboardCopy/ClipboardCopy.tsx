import React from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';

import { useClipboardCopy } from '~hooks';
import Button, { ButtonAppearance } from '~shared/Button';

interface Props {
  /** Appearance object for styling */
  appearance?: ButtonAppearance;
  /** Text for the button copy. Supports interpolation with the following variable: `valueIsCopied: boolean` */
  text?: MessageDescriptor;
  /** Value to be copied to the clipboard */
  value: string;
}

const MSG = defineMessages({
  copyLabel: {
    id: 'ClipboardCopy.copyLabel',
    defaultMessage: `{isCopied, select,
      true {Copied}
      false {Copy}
      other {}
    }`,
  },
});

const displayName = 'ClipboardCopy';

const ClipboardCopy = ({
  appearance = { size: 'small', theme: 'blue' },
  value,
  text = MSG.copyLabel,
}: Props) => {
  const { isCopied, handleClipboardCopy } = useClipboardCopy(value);
  return (
    <Button
      appearance={appearance}
      disabled={isCopied}
      onClick={handleClipboardCopy}
      text={text}
      textValues={{ isCopied }}
    />
  );
};

ClipboardCopy.displayName = displayName;

export default ClipboardCopy;
