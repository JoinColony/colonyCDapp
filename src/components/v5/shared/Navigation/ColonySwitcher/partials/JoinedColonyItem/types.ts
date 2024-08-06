import { type ColonyContextValue } from '~context/ColonyContext/ColonyContext.ts';

export interface JoinedColonyItemProps {
  name: string;
  metadata: ColonyContextValue['colony']['metadata'];
  tokenSymbol: string;
  colonyAddress: string;
  onClick: (name: string) => void;
}
