import React, { type FC } from 'react';

import specificSidePanelClasses from '../SpecifcSidePanel.styles.ts';
import { type PanelTypeProps } from '../types.ts';

const displayName = 'common.Extensions.partials.SpecificSidePanelRow';

const SpecificSidePanelRow: FC<PanelTypeProps> = ({ title, description }) => (
  <div className={specificSidePanelClasses.panelRow}>
    <p className={specificSidePanelClasses.panelTitle}>{title}</p>
    <p className={specificSidePanelClasses.panelData}>{description}</p>
  </div>
);

SpecificSidePanelRow.displayName = displayName;

export default SpecificSidePanelRow;
