import React, { FC } from 'react';
import clsx from 'clsx';
import { TransactionsProps } from './types';
import Icon from '~shared/Icon/Icon';

export const displayName = 'common.Extensions.UserHub,partials.Transactions';

const Transactions: FC<TransactionsProps> = ({ items }) => {
  return (
    <div>
      title
      <ul>
        {items.map(({ key, title, description, state = 'passed', date, content: contentItems }) => (
          <li key={key} className="border-b border-gray-100 py-3.5 last:border-none last:pb-0">
            <div className="flex gap-4 justify-between">
              <div>
                <h4 className="font-medium text-md text-gray-900">{title}</h4>
                <p className="text-gray-600 text-xs">{description}</p>
              </div>
              <div
                className={clsx('flex flex-col items-end', {
                  'text-green-400': state === 'passed',
                  'text-red-400': state === 'failed',
                })}
              >
                <Icon name={state === 'passed' ? 'check-circle' : 'warning-circle.'} appearance={{ size: 'tiny' }} />
                <span className="text-gray-400 text-xs block mt-1">{date}</span>
              </div>
            </div>
            <ol className="bg-gray-50 p-3">
              {contentItems.map(
                ({ key: contentKey, title: contentTitle, info, state: contentState = 'passed', isCurrentAction }) => (
                  <li key={contentKey}>
                    <h4 className="font-semibold text-gray-900 text-md">{contentTitle}</h4>
                    {info}
                    <div
                      className={clsx('flex flex-col items-end', {
                        'text-green-400': contentState === 'passed',
                        'text-red-400': contentState === 'failed',
                      })}
                    >
                      <Icon
                        name={contentState === 'passed' ? 'check-circle' : 'warning-circle.'}
                        appearance={{ size: 'tiny' }}
                      />
                      {isCurrentAction}
                    </div>
                  </li>
                ),
              )}
            </ol>
          </li>
        ))}
      </ul>
    </div>
  );
};

Transactions.displayName = displayName;

export default Transactions;
