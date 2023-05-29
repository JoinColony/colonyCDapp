import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel';
import ThreeColumns from '../../ThreeColumns';
import { SpinnerLoader } from '~shared/Preloaders';
import { useLazyConsensusPage } from './hooks';
import { sidePanelData } from '~common/Extensions/SpecificSidePanel/consts';
import Icon from '~shared/Icon';
import RadioList from '~shared/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { mockedGovernance } from './consts';
import Button from '~shared/Extensions/Button';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge-new';
import { FormRadioButton } from '~shared/Extensions/Fields/RadioList/types';

const LazyConsensusPage = () => {
  const { loading, extensionData, status, badgeMessage, accordionContent } = useLazyConsensusPage();
  const { openIndex, onOpenIndexChange } = useAccordion();
  const { formatMessage } = useIntl();

  const validationSchema = yup.object().shape({
    radio: yup
      .string()
      .required()
      .typeError(formatMessage({ id: 'radio.error.governance' })),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRadioButton>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = useCallback(
    (data) => {
      if (data.radio !== 'radio-button-4') return;
      onOpenIndexChange(0);
    },
    [onOpenIndexChange],
  );

  if (!extensionData) {
    return 'unsupportedExtension';
  }

  return (
    <>
      {loading ? (
        <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />
      ) : (
        <ThreeColumns
          leftAside=""
          rightAside={
            <>
              <SpecificSidePanel
                // @ts-ignore
                sidePanelData={extensionData}
                status={status}
                badgeMessage={badgeMessage}
                permissions={sidePanelData[0].permissions.permissions} // @TODO: fix that
              />
              <div className="mt-6">
                <Button isFullSize mode="tertiaryOutline">
                  {formatMessage({ id: 'deprecate.extension' })}
                </Button>
              </div>
            </>
          }
        >
          <>
            <div className="flex items-center gap-2">
              <Icon name={extensionData?.icon || ''} className="w-[2.125rem]" />
              {/* @ts-ignore */}
              <div className="text-gray-900 text-xl font-semibold">{extensionData?.name?.defaultMessage}</div>
              {/* @TODO: when status should change? */}
              <ExtensionStatusBadge mode="governance" text={formatMessage({ id: 'extensionsPage.governance' })} />
            </div>
            {/* @ts-ignore */}
            <div className="text-md text-gray-600 mt-8">{extensionData?.descriptionShort?.defaultMessage}</div>
            <br />
            <div className="text-md text-gray-600">
              {formatMessage({ id: 'extensions.lazy.consensus.description' })}
            </div>

            <div className="mt-6">
              <RadioList
                title={formatMessage({ id: 'choose.governancestyle' })}
                items={mockedGovernance}
                register={register}
                // @ts-ignore
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
              />
            </div>
            <div className="mt-6">
              <Accordion openIndex={openIndex} items={accordionContent} onOpenIndexChange={onOpenIndexChange} />
            </div>
          </>
        </ThreeColumns>
      )}
    </>
  );
};

export default LazyConsensusPage;
