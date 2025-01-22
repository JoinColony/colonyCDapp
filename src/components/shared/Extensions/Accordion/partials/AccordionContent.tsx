import React, { type SyntheticEvent, type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { GovernanceOptions } from '~frame/Extensions/pages/ExtensionsPage/types.ts';
import SpecialHourInput from '~shared/Extensions/ConnectForm/partials/SpecialHourInput.tsx';
import SpecialPercentageInput from '~shared/Extensions/ConnectForm/partials/SpecialPercentageInput.tsx';

import { type AccordionItemProps } from '../types.ts';

import AccordionNestedItem from './AccordionNested/AccordionNestedItem.tsx';

const displayName = 'Extensions.Accordion.partials.AccordionContent';

const AccordionContent: FC<AccordionItemProps> = ({
  content,
  onInputChange,
}) => {
  const {
    setValue,
    formState: { isSubmitting },
  } = useFormContext();

  const { isPendingManagement } = useExtensionDetailsPageContext();

  const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    onInputChange?.(e);
    setValue('option', GovernanceOptions.CUSTOM);
  };

  const isFormDisabled = isPendingManagement || isSubmitting;

  return (
    <div className="mt-6">
      {content?.map(
        ({
          id,
          textItem,
          inputData: { name, inputType, step },
          accordionItem,
        }) => {
          return (
            <div
              key={id}
              className="mt-6 border-b border-gray-200 pb-6 last:border-none last:pb-0"
            >
              <div className="flex justify-between">
                {textItem}
                <div className="ml-6 shrink-0">
                  <div className="mr-[0.1875rem]">
                    {inputType === 'percent' ? (
                      <SpecialPercentageInput
                        name={name}
                        step={step}
                        onInputChange={handleInputChange}
                        disabled={isFormDisabled}
                      />
                    ) : (
                      <SpecialHourInput
                        name={name}
                        step={step}
                        onInputChange={onInputChange}
                        disabled={isFormDisabled}
                      />
                    )}
                  </div>
                </div>
              </div>
              {accordionItem && (
                <div className="mt-6">
                  {accordionItem.map((item) => (
                    <AccordionNestedItem key={item.id} accordionItem={item} />
                  ))}
                </div>
              )}
            </div>
          );
        },
      )}
    </div>
  );
};

AccordionContent.displayName = displayName;

export default AccordionContent;
