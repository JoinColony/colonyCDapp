export const fetchArbiscanContract = async (contractAddress: string) => {
  const response = await fetch(
    `${import.meta.env.ARBISCAN_API}` +
      `?apiKey=${import.meta.env.ARBISCAN_API_KEY}` +
      `&module=contract` +
      `&action=getabi` +
      `&address=${contractAddress}`,
  ).then((result) => result.json());

  return response;
};
