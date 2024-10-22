export function getTenantId(): string {
  return process.env.AZURE_AD_TENANT_ID ?? ''
}

export function getClientId(): string {
  return process.env.AZURE_AD_CLIENT_ID ?? ''
}

export function getClientSecret(): string {
  return process.env.AZURE_AD_CLIENT_SECRET ?? ''
}

export function getScopes(): string {
  return process.env.AZURE_AD_SCOPES ?? ''
}

export function getApplicationRoot(): string {
  return process.env.APPLICATION_ROOT ?? ''
}

export const getSessionSecret = () => {
  return process.env.SESSION_SECRET ?? ''
}

export function getEmployeeIdFromToken(token: string): number | null {
  console.log("TOKEN", token)
  return 1798
}