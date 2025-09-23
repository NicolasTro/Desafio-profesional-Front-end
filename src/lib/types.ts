// Información de usuario
export interface UserData {
  id: string;
  name?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: string | null;
  dni?: string | null;
  exp?: number | null;
}

// Información de la cuenta
export interface AccountData {
  account_id: string;
  cvu?: string | null;
  alias?: string | null;
  available_amount?: number | null;
}
