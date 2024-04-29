import { Record } from 'immutable';

import {
  CORE_DECISIONS,
  CORE_GAS_PRICES,
  CORE_MESSAGES,
} from '../constants.ts';
import { GasPrices, type GasPricesRecord } from '../immutable/index.ts';

import { CoreDecisions, type CoreDecisionsRecord } from './decisions.ts';
import { CoreMessages, type CoreMessagesRecord } from './messages.ts';

type RootStateProps = {
  [CORE_GAS_PRICES]: GasPricesRecord;
  [CORE_MESSAGES]: CoreMessagesRecord;
  [CORE_DECISIONS]: CoreDecisionsRecord;
};

export class RootStateRecord extends Record<RootStateProps>({
  [CORE_GAS_PRICES]: GasPrices(),
  [CORE_MESSAGES]: CoreMessages(),
  [CORE_DECISIONS]: CoreDecisions(),
}) {}
