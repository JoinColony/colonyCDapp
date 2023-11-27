export const useGetExtensionsViews = async () => {
  const colonyMetrics =
    'https://api.thegraph.com/subgraphs/name/arrenv/colony-metrics-subgraph';
  const metricsRes = fetch(colonyMetrics, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
          votingReputationExtensions(first: 5) {
            installs
          }
          oneTxPaymentExtensions(first: 5) {
            installs
          }
        }`,
      variables: {},
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.error(e);
    });

  const [metricsOutput] = await Promise.all([metricsRes]);
  return metricsOutput.data;
};
