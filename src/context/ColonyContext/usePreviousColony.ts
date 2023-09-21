import { useEffect, useState } from 'react';
import { Colony } from '~types';
import { ContextModule, setContext } from '~context';

export const usePreviousColony = ({ colony }: { colony?: Colony }) => {
  const [prevColony, setPrevColony] = useState<Colony>();

  useEffect(() => {
    if (colony) {
      // This is useful when adding transactions to the db from the client
      setContext(ContextModule.CurrentColonyAddress, colony?.colonyAddress);

      // This is useful for the case where we're at a route without a colony in the params,
      // and we pass down the metacolony while we retreive the previously stored colony
      // name from local storage and then go fetch that. There's a small period while fetching for the second time
      // where we don't want to show a loader (to avoid ui-loader flashing), but we do still want to pass an actual colony
      // (instead of undefined). Thus we pass the colony that got fetched the first time (i.e. the metacolony)
      setPrevColony(colony);
    }
  }, [colony]);

  return { prevColony };
};
