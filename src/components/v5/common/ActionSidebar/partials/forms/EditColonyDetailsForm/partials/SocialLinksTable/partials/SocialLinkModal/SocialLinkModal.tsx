import React, { FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import FormTileRadioButtons from '~v5/common/Fields/RadioButtons/TileRadioButtons/FormTileRadioButtons.tsx';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import {
  LINK_TYPE_RADIO_BUTTONS,
  LINK_TYPE_TO_LABEL_MAP,
  SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA,
} from './consts.tsx';
import { useResetFormOnLinkTypeChange } from './hooks.ts';
import {
  SocialLinkModalFormValues,
  SocialLinkFormModalProps,
} from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.SocialLinksTable.partials.SocialLinkFormModal';

const SocialLinkFormModal: FC<SocialLinkFormModalProps> = ({
  onSubmit,
  defaultValues: defaultValuesProp,
  initialLinkType,
  ...rest
}) => {
  const { onClose } = rest;
  const { setFormRef } = useResetFormOnLinkTypeChange(
    defaultValuesProp,
    initialLinkType,
  );

  return (
    <Modal buttonMode="primarySolid" icon="smile" isFullOnMobile {...rest}>
      <Form<SocialLinkModalFormValues>
        ref={(ref) => setFormRef(ref)}
        onSubmit={onSubmit}
        validationSchema={SOCIAL_LINK_FORM_MODAL_VALIDATION_SCHEMA}
      >
        {({ getValues }) => (
          <>
            <h5 className="heading-5 mb-1.5">
              {formatText({ id: 'editColony.socialLinks.modal.title' })}
            </h5>
            <p className="text-md text-gray-600 mb-10 md:mb-6">
              {formatText({ id: 'editColony.socialLinks.modal.subtitle' })}
            </p>
            <FormTileRadioButtons
              name="name"
              className="grid md:grid-cols-3 gap-y-3 gap-x-4"
              items={LINK_TYPE_RADIO_BUTTONS}
            />
            {getValues('name') && (
              <>
                <FormInputBase
                  wrapperClassName="mt-6"
                  name="link"
                  label={LINK_TYPE_TO_LABEL_MAP[getValues('name')]}
                />
                <div className="flex flex-col-reverse gap-3 mt-[5.625rem] md:mt-8 sm:flex-row">
                  <Button
                    type="button"
                    mode="primaryOutline"
                    isFullSize
                    onClick={() => onClose()}
                  >
                    {formatText({ id: 'button.cancel' })}
                  </Button>
                  <Button mode="primarySolid" isFullSize type="submit">
                    {formatText({
                      id: defaultValuesProp.some(
                        ({ name }) => name === getValues('name'),
                      )
                        ? 'button.editLink'
                        : 'button.addLink',
                    })}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

SocialLinkFormModal.displayName = displayName;

export default SocialLinkFormModal;
