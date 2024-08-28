import React, { type FC, type PropsWithChildren, useState } from 'react';
import Joyride, { STATUS, type Step } from 'react-joyride';

interface TourProviderProps {
  // Props configuration here
}

const TourProvider: FC<PropsWithChildren<TourProviderProps>> = ({
  children,
}) => {
  const [run, setRun] = useState(true);

  const steps: Step[] = [
    // Steps configuration here
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        callback={handleJoyrideCallback}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
      />
      {children}
    </>
  );
};

export default TourProvider;
