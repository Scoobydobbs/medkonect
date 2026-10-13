import crypto from 'crypto';

/**
 * Generates a SHA-256 hash of arbitrary payload data
 */
export function generateHash(payload: unknown): string {
  const content = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Creates an append-only tamper-evident hash chain block
 */
export function createChainBlock(previousHash: string, data: unknown) {
  const timestamp = new Date().toISOString();
  const payloadHash = generateHash(data);
  const currentHash = generateHash({
    previousHash,
    payloadHash,
    timestamp,
  });

  return {
    previousHash,
    payloadHash,
    currentHash,
    timestamp,
  };
}

/**
 * Validates whether a given block has been tampered with
 */
export function verifyBlockIntegrity(
  previousHash: string,
  payloadHash: string,
  timestamp: string,
  currentHash: string
): boolean {
  const expectedHash = generateHash({
    previousHash,
    payloadHash,
    timestamp,
  });
  return expectedHash === currentHash;
}

/**
 * Signs a credential using an authority mock private key
 */
export function signCredential(regNo: string, council: string, validUpto: string): string {
  const payload = `${regNo}:${council}:${validUpto}:SECRET_COUNCIL_KEY_2026`;
  return crypto.createHash('sha256').update(payload).digest('hex').substring(0, 32);
}

/**
 * Verifies if the signature matches
 */
export function verifyCredentialSignature(
  regNo: string,
  council: string,
  validUpto: string,
  signature: string
): boolean {
  const expected = signCredential(regNo, council, validUpto);
  return expected === signature;
}
