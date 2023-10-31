import React from 'react';
import { DeepPartial } from 'utility-types';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { ManageColonyObjectivesFormValues } from './consts';

export const manageColonyObjectivesDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<ManageColonyObjectivesFormValues>
> = async () => <span>Manage Colony Objective</span>;
