import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import { Annotations } from '~shared/Fields';

const displayName = 'common.Dialogs.RaiseObjectionDialog.ObjectionAnnotation';

const MSG = defineMessages({
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you’re making this objection (optional)`,
  },
});

interface ObjectionAnnotationProps {
  disabled: boolean;
}

const ObjectionAnnotation = ({ disabled }: ObjectionAnnotationProps) => (
  <DialogSection appearance={{ border: 'top' }}>
    <Annotations
      label={MSG.annotation}
      name="annotation"
      maxLength={4000}
      disabled={disabled}
    />
  </DialogSection>
);

ObjectionAnnotation.displayName = displayName;

export default ObjectionAnnotation;
