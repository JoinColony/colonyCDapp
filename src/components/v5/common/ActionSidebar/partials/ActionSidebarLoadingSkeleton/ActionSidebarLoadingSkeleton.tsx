import clsx from 'clsx';
import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';

const displayName = `v5.common.ActionSidebar.partials.ActionSidebarLoadingSkeleton`;

const ActionSidebarLoadingSkeleton = () => {
  const renderSkeleton = () => (
    <div className={clsx('w-full overflow-y-auto px-6 pb-6 pt-8 sm:w-full')}>
      <div className="mb-2">
        <LoadingSkeleton
          isLoading
          className="h-[1.875rem] w-full max-w-[32.1875rem] rounded"
        />
      </div>
      <div className="mb-6">
        <LoadingSkeleton
          isLoading
          className="h-5 w-full max-w-[22.5rem] rounded"
        />
      </div>
      <div>
        {new Array(7).fill(0).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="mt-2 flex w-full max-w-[25rem] gap-2">
            <div className="mt-2 flex w-1/2 items-center gap-2">
              <LoadingSkeleton
                isLoading
                className="h-[.875rem] w-[.875rem] rounded"
              />
              <LoadingSkeleton
                isLoading
                className={clsx('h-5 w-full rounded', {
                  'max-w-[6.25rem]': index !== 1 && index !== 3,
                  'md:max-w-[5.625rem]': index === 1,
                  'md:max-w-[5rem]': index === 3,
                })}
              />
            </div>
            <div className="mt-2 flex w-1/2 items-center gap-2">
              {index !== 2 && index !== 3 && (
                <LoadingSkeleton
                  isLoading
                  className={clsx('h-5 w-full max-w-[18.75rem] rounded', {
                    'rounded-3xl': index === 1 || index === 5,
                    'max-w-[8.125rem]': index === 0,
                    'max-w-[18.75rem]': index === 6,
                    'max-w-[5.6875rem]': index === 1 || index === 5,
                    'max-w-[6.875rem]': index === 4,
                    'max-w-[4.5625rem]': index === 2,
                  })}
                />
              )}
              {index === 2 && (
                <div className="flex items-center gap-2">
                  <LoadingSkeleton isLoading className="h-5 w-5 rounded-3xl" />
                  <LoadingSkeleton
                    isLoading
                    className="h-5 w-[2.8125rem] rounded"
                  />
                </div>
              )}
              {index === 3 && (
                <div className="flex items-center gap-2">
                  <LoadingSkeleton
                    isLoading
                    className="h-5 w-[2.8125rem] rounded"
                  />
                  <LoadingSkeleton
                    isLoading
                    className="ml-1 h-5 w-5 rounded-3xl"
                  />
                  <LoadingSkeleton
                    isLoading
                    className="h-5 w-[2.8125rem] rounded"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-grow flex-col-reverse justify-end overflow-auto sm:flex-row sm:justify-start">
      {renderSkeleton()}

      <div
        className={`
              w-full
              border-b
              border-b-gray-200
              bg-gray-25
              px-6
              py-8
              sm:h-full
              sm:w-[23.75rem]
              sm:flex-shrink-0
              sm:overflow-y-auto
              sm:border-b-0
              sm:border-l
              sm:border-l-gray-200
            `}
      >
        <div className="flex">
          <div className="mr-[-.3450rem] mt-2">
            {new Array(72).fill(0).map((_, index) => (
              <LoadingSkeleton
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                isLoading
                className="mb-[.0625rem] h-[.1875rem] w-[.0625rem] rounded"
              />
            ))}
            <LoadingSkeleton
              isLoading
              className="mb-[.0625rem] h-[40px] w-[.0625rem] rounded"
            />
          </div>
          <div>
            <div className="mb-4 flex items-center gap-4">
              <LoadingSkeleton
                isLoading
                className="h-[.625rem] w-[.625rem] rounded-3xl"
              />
              <LoadingSkeleton
                isLoading
                className="h-6 w-[3.75rem] rounded-3xl"
              />
            </div>
            <div className="ml-6 w-[19.3125rem]">
              <MenuWithStatusText
                statusText={
                  <div className="flex items-center gap-2">
                    <LoadingSkeleton
                      isLoading
                      className=" h-[.875rem] w-[.875rem] rounded"
                    />
                    <LoadingSkeleton
                      isLoading
                      className=" h-[.6875rem] w-full rounded"
                    />
                  </div>
                }
                sections={[
                  {
                    key: '1',
                    content: (
                      <div className="flex gap-4">
                        <div className="w-full">
                          {new Array(4).fill(0).map((_, index) => (
                            <div
                              // eslint-disable-next-line react/no-array-index-key
                              key={index}
                              className="mt-2 items-center gap-2"
                            >
                              <LoadingSkeleton
                                isLoading
                                className={clsx('h-5 rounded', {
                                  'w-[4rem]': index % 2 === 0,
                                  'w-[2.9375rem]': index % 2 === 1,
                                })}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="w-full">
                          <LoadingSkeleton
                            isLoading
                            className="mt-2 h-5 w-0 rounded"
                          />
                          <div className="ml-[3.4375rem] flex w-full gap-2">
                            <LoadingSkeleton
                              isLoading
                              className="mt-2 h-5 w-5 rounded-3xl"
                            />
                            <LoadingSkeleton
                              isLoading
                              className="mt-2 h-5 w-11 rounded"
                            />
                          </div>
                          <LoadingSkeleton
                            isLoading
                            className="ml-[4.0625rem] mt-2 h-5 w-[4rem] rounded-3xl"
                          />
                          <LoadingSkeleton
                            isLoading
                            className="mt-2 h-5 w-full rounded"
                          />
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
            {new Array(3).fill(0).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className="mt-4 flex items-center gap-4">
                <LoadingSkeleton
                  isLoading
                  className={clsx('h-[.625rem] w-[.625rem] rounded-3xl')}
                />
                <LoadingSkeleton
                  isLoading
                  className={clsx('h-6 w-[3.75rem] rounded-3xl', {
                    'w-[4rem]': index === 1,
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

ActionSidebarLoadingSkeleton.displayName = displayName;

export default ActionSidebarLoadingSkeleton;
