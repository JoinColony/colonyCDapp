module.exports = {
  /*
   * @TODO Once we figure out how sorting actually works reliably
   * we can be done away with all this manual sorting
   */
  sortDomainsByNativeId: (
    { nativeId: nativeIdFirstDomain },
    { nativeId: nativeIdSecondDomain },
  ) => nativeIdFirstDomain - nativeIdSecondDomain,
  sortTokensByCreationDate: (
    { createdAt: createdAtFirstToken },
    { createdAt: createdAtSecondToken },
  ) => Date.parse(createdAtFirstToken) - Date.parse(createdAtSecondToken),
};
