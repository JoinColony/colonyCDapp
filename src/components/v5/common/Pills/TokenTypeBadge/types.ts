export const TOKEN_TYPE = {
  reputation: 'reputation-token',
  native: 'native-token',
};

export interface TokenTypeBadgeProps {
  tokenType: TokenType;
}

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];
