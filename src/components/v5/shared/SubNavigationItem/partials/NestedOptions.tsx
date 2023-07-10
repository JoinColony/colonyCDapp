import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { contributorTypes } from '~v5/common/Filter/partials/consts';
import Checkbox from '~v5/common/Checkbox';
import { NestedOptionsProps } from '../types';
import Header from './Header';

const displayName = 'v5.SubNavigationItem';

const NestedOptions: FC<NestedOptionsProps> = ({
  selectedOption,
  onChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Header title={{ id: 'contributor.type' }} />
      <ul className="flex flex-col">
        {selectedOption === 'contributor' &&
          contributorTypes.map(({ id, title }) => (
            <li key={id}>
              <button
                className="subnav-button"
                type="button"
                aria-label={formatMessage({ id: 'checkbox.select.filter' })}
              >
                <Checkbox
                  id={id}
                  name={id}
                  label={title}
                  onChange={() => onChange?.(id)}
                />
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

NestedOptions.displayName = displayName;

export default NestedOptions;
