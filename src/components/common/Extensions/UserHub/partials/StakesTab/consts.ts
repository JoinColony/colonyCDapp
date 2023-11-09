export const stakesMock = [
  {
    key: '1',
    title: 'Transfer funds',
    date: '21 Feb 2023',
    stake: 'Stake: 2,300 CLNY',
    transfer: 'Transfer 500xDAI from Root to Business',
    status: 'staking',
    filterBy: 'all',
  },
  {
    key: '2',
    title: 'Simple payments',
    date: '11 Feb 2023',
    stake: 'Stake: 10,000 CLNY',
    transfer: 'Pay Panda 100,000 CLNY',
    status: 'finalizable',
    filterBy: 'finalized',
  },
  {
    key: '3',
    title: 'Transfer funds',
    date: '21 Oct 2022',
    stake: 'Stake: 2,300 CLNY',
    transfer: 'Transfer 500xDAI from Root to Business',
    status: 'claimed',
    filterBy: 'claimable',
  },
  {
    key: '4',
    title: 'Transfer funds',
    date: '8 Sep 2022',
    stake: 'Stake: 11,000 CLNY',
    transfer: 'Transfer 1,500xDAI from Design to Development',
    status: 'claimed',
    filterBy: 'claimable',
  },
  {
    key: '5',
    title: 'Transfer funds',
    date: '8 Sep 2022',
    stake: 'Stake: 11,000 CLNY',
    transfer: 'Transfer 500xDAI from Root to Business',
    status: 'claimed',
    filterBy: 'claimable',
  },
];

export const tabsItems: any[] = [
  { id: 0, type: 'all', title: 'All' },
  { id: 1, type: 'finalized', title: 'Finalized' },
  { id: 2, type: 'claimable', title: 'Claimable' },
];
