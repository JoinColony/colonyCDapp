export type MotionStakedEventValues = {
  amount: string;
  motionId: string;
  stakeAmount: string;
  staker: string;
  vote: number;
};

export type MotionStakedEvent = {
  address: string;
  blockNumber: number;
  hash: string;
  index: string;
  name: string;
  signature: string;
  timestamp: number;
  topic: string;
  values: MotionStakedEventValues;
};
