import React from 'react';
import { defineMessages } from 'react-intl';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useRichTextEditor } from '~hooks';
import { DialogSection } from '~shared/Dialog';
import { Annotations, InputLabel } from '~shared/Fields';
import RichTextEditor from '~shared/RichTextEditor/RichTextEditor';

import styles from './ObjectionAnnotation.css';

const displayName = 'common.Dialogs.RaiseObjectionDialog.ObjectionAnnotation';

const MSG = defineMessages({
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you're making this objection (optional)`,
  },
});

interface ObjectionAnnotationProps {
  disabled: boolean;
  isDecision: boolean;
}

const ObjectionAnnotation = ({
  disabled,
  isDecision,
}: ObjectionAnnotationProps) => {
  const { editor } = useRichTextEditor();

  return (
    <DialogSection appearance={{ border: 'top' }}>
      {isDecision && editor ? (
        <>
          <InputLabel
            label={MSG.annotation}
            appearance={{ colorSchema: 'grey' }}
          />
          <RichTextEditor
            name="annotation"
            editor={editor}
            disabled={disabled}
            className={styles.editor}
          />
        </>
      ) : (
        <Annotations
          label={MSG.annotation}
          name="annotation"
          maxLength={MAX_ANNOTATION_LENGTH}
          disabled={disabled}
        />
      )}
    </DialogSection>
  );
};

ObjectionAnnotation.displayName = displayName;

export default ObjectionAnnotation;
