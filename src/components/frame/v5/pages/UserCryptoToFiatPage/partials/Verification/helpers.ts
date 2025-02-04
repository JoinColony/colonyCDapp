export const parsePersonaURL = (url: string) => {
  try {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);

    const templateId = searchParams.get('inquiry-template-id') ?? '';
    const referenceId = searchParams.get('reference-id') ?? '';

    // Extract all fields with format fields[key]
    const fields: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      const fieldMatch = key.match(/^fields\[(.*?)\]$/);
      if (fieldMatch) {
        const fieldKey = fieldMatch[1];
        fields[fieldKey] = value;
      }
    }

    return { templateId, referenceId, fields };
  } catch (error) {
    console.error('Error parsing Persona KYC URL', error);
    return null;
  }
};
