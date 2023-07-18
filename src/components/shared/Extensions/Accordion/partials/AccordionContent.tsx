import React, { FC } from 'react';

import { AccordionItemProps } from '../types';
import AccordionContentItem from './AccordionContentItem';
import SpecialPercentageInput from './SpecialPercentageInput';
import SpecialHourInput from './SpecialHourInput';

const displayName = 'Extensions.Accordion.partials.AccordionContent';

const AccordionContent: FC<AccordionItemProps> = ({ content, errors }) => (
  <div className="relative">
    {content?.map(
      ({
        id,
        textItem,
        inputData: { inputType, name, minValue, maxValue, register },
        accordionItem,
      }) => (
        <div key={id}>
          <div className="flex justify-between mt-6 items-center">
            {textItem && (
              <div>
                <p
                  className="text-1 mb-0.5"
                  dangerouslySetInnerHTML={{ __html: textItem?.props.title }}
                />
                <p
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: textItem?.props.subTitle }}
                />
              </div>
            )}

            {inputType && (
              <div className="ml-6">
                {inputType === 'percent' ? (
                  <SpecialPercentageInput
                    name={name}
                    minValue={minValue}
                    maxValue={maxValue}
                    register={register}
                    errors={errors}
                  />
                ) : (
                  <SpecialHourInput
                    name={name}
                    minValue={minValue}
                    maxValue={maxValue}
                    register={register}
                    errors={errors}
                  />
                )}
              </div>
            )}
          </div>
          {accordionItem &&
            accordionItem.map((item) => (
              <AccordionContentItem key={item.id} accordionItem={item} />
            ))}
        </div>
      ),
    )}
  </div>
);

AccordionContent.displayName = displayName;

export default AccordionContent;
