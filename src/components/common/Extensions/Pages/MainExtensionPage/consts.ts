/* eslint-disable max-len */
import { ExtensionItem } from './types';

export const extensionsList: ExtensionItem[] = [
  {
    id: '1',
    title: 'One Transaction Payment',
    description: 'Make quick and simple payments to members or any address on the same network.',
    version: 'v3',
    badgeText: 'Disabled',
    status: 'disabled',
    isInstalled: true,
    icon: 'extension-one-transaction-payment',
  },
  {
    id: '2',
    title: 'Advanced Payments',
    description:
      'Make payments to multiple recipients, with different tokens and times. Also make batch payments, split payments, staged payments & streaming payments.',
    version: 'v1',
    badgeText: 'Coming soon',
    status: 'coming-soon',
    icon: 'extension-advanced-payments',
  },
];
