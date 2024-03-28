import { type ZeroValue } from '~utils/reputation.ts';

export interface ManageReputationTableProps {
  formattedReputationPoints: string;
  percentageReputation: number | ZeroValue;
  formattedNewReputationPoints: string;
  newPercentageReputation: number | ZeroValue;
  changeContent: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  isError?: boolean;
}
