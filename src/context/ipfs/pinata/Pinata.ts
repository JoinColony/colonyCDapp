import clientSecrets from '~utils/clientSecrets.ts';

import { PINATA_ENDPOINT, JSON_MIME_TYPE } from './constants.ts';

class Pinata {
  private readonly secrets = clientSecrets;

  /**
   * Return a JSON string to IPFS using the Pinata.cloud API
   */
  async addJSON(data: string): Promise<string | null> {
    let responseData: string | undefined;
    const potentialJSONBlob: any =
      typeof data !== 'string' ? JSON.stringify(data) : data;

    try {
      if (!(import.meta.env.PINATA_API_KEY && this.secrets.pinataApiSecret)) {
        throw new Error('Client does not have the correct Pinata API keys');
      }
      /*
       * Try our best to validate the JSON file
       */
      try {
        JSON.parse(potentialJSONBlob);
      } catch (error) {
        throw new Error(`Malformed JSON data supplied: ${potentialJSONBlob}`);
      }
      const response = await fetch(`${PINATA_ENDPOINT}/pinJSONToIPFS`, {
        method: 'POST',
        /*
         * @NOTE This is because Pinata.cloud makes us supply their non-standard headers
         */
        headers: {
          // eslint-disable-next-line camelcase
          pinata_api_key: import.meta.env.PINATA_API_KEY,
          // eslint-disable-next-line camelcase
          pinata_secret_api_key: this.secrets.pinataApiSecret,
          'Content-Type': JSON_MIME_TYPE,
        },
        body: potentialJSONBlob,
      });

      let postResponse;
      try {
        postResponse = await response.json();
      } catch (error) {
        throw new Error(`POST response from Pinata failed: ${postResponse}`);
      }

      responseData = postResponse?.IpfsHash;
      if (!responseData) {
        throw new Error(
          `Failed upload the data to IPFS using Pinata API: ${JSON.stringify(
            postResponse,
          )}`,
        );
      }
      return responseData;
    } catch (error) {
      console.error('Could not save data to IPFS using Pinata API:', data);
      console.error(error);
      return null;
    }
  }
}

export default Pinata;
