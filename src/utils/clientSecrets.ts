interface ClientSecrets {
  pinataApiSecret: string;
  coinGeckoApiKey: string;
  arbiscanApiKey: string;
}

const clientSecrets: ClientSecrets = {
  pinataApiSecret: '',
  coinGeckoApiKey: '',
  arbiscanApiKey: '',
};

export const setClientSecrets = (secrets: Partial<ClientSecrets>) => {
  Object.assign(clientSecrets, secrets);
};

export default clientSecrets;
