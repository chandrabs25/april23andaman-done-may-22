import crypto from 'crypto';

export function generateXVerifyHeader(
  payloadBase64: string,
  apiEndpointPath: string,
  saltKey: string,
  saltIndex: string
): string {
  const stringToHash = payloadBase64 + apiEndpointPath + saltKey;
  const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256Hash}###${saltIndex}`;
}

export function verifyXVerifyHeader(
  base64Response: string, // This is the raw base64 encoded response string from PhonePe
  receivedXVerifyHeader: string,
  saltKey: string,
  saltIndex: string
): boolean {
  // IMPORTANT: Confirm the exact stringToHash components for S2S callback verification from PhonePe documentation.
  // Common pattern is base64Response + saltKey, but it can vary.
  const stringToHash = base64Response + saltKey; // Assuming this for now
  const calculatedSha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const generatedHeader = `${calculatedSha256Hash}###${saltIndex}`;
  return generatedHeader === receivedXVerifyHeader;
}
