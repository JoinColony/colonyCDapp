/**
 * Unlocks a token.
 *
 * @async
 * @function unlockToken
 * @param {Object} token - The token contract representing the token to be unlocked.
 * @param {number|string|BigNumber} tokenAmount - The amount of tokens to mint.
 * @returns {Promise<void>} A promise that resolves when the token has been successfully unlocked.
 * @throws Will log an error message if unlocking the token fails.
 */
const unlockToken = async (token) => {
  const tokenAddress = token.address;
  try {
    await token.unlock();
    console.log(`Token with address ${tokenAddress} successfully unlocked.`);
  } catch {
    console.error(`Error while unlocking token with address ${tokenAddress}.`);
  }
};

/**
 * Mints a specified amount of tokens to the colony address.
 *
 * @async
 * @function mintTokens
 * @param {string} colonyAddress - The address of the colony where the tokens will be minted.
 * @param {Object} token - The token contract representing the token to be minted.
 * @param {number|string|BigNumber} tokenAmount - The amount of tokens to mint.
 * @returns {Promise<void>} A promise that resolves when the token has been successfully minted.
 * @throws Will log an error message if minting the token fails.
 */
const mintTokens = async (colonyAddress, token, tokenAmount) => {
  const tokenAddress = token.address;
  try {
    await token['mint(address,uint256)'](colonyAddress, tokenAmount);
    console.log(
      `Successfully minted ${tokenAmount} tokens for token with address ${tokenAddress} to colony with address ${colonyAddress}.`,
    );
  } catch {
    console.error(
      `Error while unlocking and minting foreign token with address ${tokenAddress}.`,
    );
  }
};

module.exports = {
  unlockToken,
  mintTokens,
};
