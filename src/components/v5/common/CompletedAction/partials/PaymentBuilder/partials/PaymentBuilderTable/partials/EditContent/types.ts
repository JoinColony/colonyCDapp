import { type Row } from '@tanstack/react-table';

import { type PaymentBuilderTableModel } from '../../types.ts';

export interface EditContentProps {
  actionRow: Row<PaymentBuilderTableModel>;
}
