/**
 * Unlocks a token and mints a specified amount of tokens to the colony address.
 *
 * @async
 * @function unlockMintTokens
 * @param {string} colonyAddress - The address of the colony where the tokens will be minted.
 * @param {Object} token - The token contract representing the token to be unlocked and minted.
 * @param {number|string|BigNumber} tokenAmount - The amount of tokens to mint.
 * @returns {Promise<void>} A promise that resolves when the token has been successfully unlocked and minted.
 * @throws Will log an error message if unlocking or minting the token fails.
 */
const unlockMintTokens = async (colonyAddress, token, tokenAmount) => {
  const tokenAddress = token.address;
  try {
    await token.unlock();

    // The proxy colony address is the same as the main colony address
    await token['mint(address,uint256)'](colonyAddress, tokenAmount);

    console.log(
      `Proxy token with address ${tokenAddress} successfully unlocked and ${tokenAmount} tokens were minted.`,
    );
  } catch {
    console.error(
      `Error while unlocking and minting foreign token with address ${tokenAddress}.`,
    );
  }
};

module.exports = {
  unlockMintTokens,
};
