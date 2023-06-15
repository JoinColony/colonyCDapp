import axios from 'axios';
import { useState, useEffect } from 'react';

const useFetchActiveInstallsExtension = () => {
  const [oneTxPaymentData, setOneTxPaymentData] = useState<string>();
  const [votingReputationData, setVotingReputationData] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await axios({
          method: 'post',
          url: 'https://api.thegraph.com/subgraphs/name/arrenv/colony-metrics-subgraph',
          data: {
            query: `{
                  votingReputationExtensions(first: 5) {
                    installs
                  }
                  oneTxPaymentExtensions(first: 5) {
                    installs
                  }
                }`,
          },
        });
        setOneTxPaymentData(
          responseData.data.data.oneTxPaymentExtensions[0].installs,
        );
        setVotingReputationData(
          responseData.data.data.votingReputationExtensions[0].installs,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return { votingReputationData, oneTxPaymentData };
};

export default useFetchActiveInstallsExtension;
