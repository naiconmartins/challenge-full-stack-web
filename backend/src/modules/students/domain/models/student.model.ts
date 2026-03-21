export interface StudentModel {
  id: string;
  ra: string;
  name: string;
  email: string;
  cpf: string;
  created_by: string | null;
  updated_by: string | null;
  created_at: Date;
  updated_at: Date;
}
