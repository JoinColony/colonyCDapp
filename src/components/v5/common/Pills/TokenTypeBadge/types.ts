export interface TokenTypeBadgeProps {
  tokenType: TokenType;
  name?: string;
}

export const TOKEN_TYPE = {
  REPUTATION: 'reputation-token',
  NATIVE: 'native-token',
};

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];
