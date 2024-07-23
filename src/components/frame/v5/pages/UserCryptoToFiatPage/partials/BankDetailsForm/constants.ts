export const IBAN_REGEX =
  /^([A-Z]{2}[ +\\-]?[0-9]{2})(?=(?:[ +\\-]?[A-Z0-9]){9,30}$)((?:[ +\\-]?[A-Z0-9]{3,5}){2,7})([ +\\-]?[A-Z0-9]{1,3})?$/;

export const BIC_REGEX =
  // eslint-disable-next-line max-len
  /^([a-zA-Z]{4})([a-zA-Z]{2})(([2-9a-zA-Z]{1})([0-9a-np-zA-NP-Z]{1}))((([0-9a-wy-zA-WY-Z]{1})([0-9a-zA-Z]{2}))|([xX]{3})?)$/;
