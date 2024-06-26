/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { type FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { type CountryData } from '~utils/countries.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';

interface ContactDetailsFormProps {
  onSubmit: (values: any) => void;
  selectedCountry: CountryData | null;
}
export const ContactDetailsForm: FC<ContactDetailsFormProps> = ({
  onSubmit,
  selectedCountry,
}) => {
  return (
    <div>
      Contact details
      <Form onSubmit={onSubmit}>
        <FormRow>
          <FormInput
            name="date"
            label="Date of birth"
            placeholder="YYYY-MM-DD"
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="tax"
            label="Tax identification number (eg. social security number or EIN)"
            placeholder="Tax identification number"
          />
        </FormRow>

        {!!selectedCountry?.subdivisions?.length && (
          <>
            <label className="mb-1.5 text-md font-medium text-gray-700">
              Adress
            </label>

            <FormRow>
              <FormInput name="address1" placeholder="Address line 1" />
            </FormRow>
            <FormRow>
              <FormInput name="address2" placeholder="Address line 2" />
            </FormRow>
            <FormRow>
              <div className="flex">
                <div className="flex-1">
                  <FormInput name="city" placeholder="City" />
                </div>

                <div className="flex-1">
                  <FormSelect
                    name="subdivisions"
                    options={selectedCountry?.subdivisions.map((item) => ({
                      value: item.code,
                      label: item.name,
                    }))}
                  />
                </div>
              </div>
            </FormRow>

            <FormRow>
              <FormInput name="postcode" placeholder="Postcode" />
            </FormRow>
          </>
        )}
        <Button type="submit">Next</Button>
      </Form>
    </div>
  );
};
