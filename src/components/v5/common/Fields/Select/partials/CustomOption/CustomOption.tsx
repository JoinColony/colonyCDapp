import React from 'react';

import Link from '~v5/shared/Link/index.ts';

import { SelectOption } from '../../types.ts';

const displayName = 'v5.common.Fields.Select.partials.CustomOption';

const CustomOption: React.FC<SelectOption> = ({ label, to }) =>
  to ? (
    <Link to={to}>{label}</Link>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{label}</>
  );

CustomOption.displayName = displayName;

export default CustomOption;
