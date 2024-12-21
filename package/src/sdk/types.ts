

export enum AuthType {
  OAUTH_1 = "OAUTH_1",
  OAUTH_2 = "OAUTH_2",
  API_KEY = "API_KEY",
  PASSWORD_BASED_AUTH = "PASSWORD_BASED_AUTH"
}

export type AppAuth = {
  appAddress: string;
  authUri: string;
}

export type UserAuth = {
  appAddress: string;
  authority: string;
  authUri: string;
}


