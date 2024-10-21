import { type Row } from '@tanstack/react-table';

import { type PaymentBuilderTableModel } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderTable/types.ts';

export interface EditContentProps {
  actionRow: Row<PaymentBuilderTableModel>;
}
