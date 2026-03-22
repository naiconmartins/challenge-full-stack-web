export interface Student {
  id: string
  ra: string
  name: string
  email: string
  cpf: string
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface StudentListResponse {
  items: Student[]
  total: number
  current_page: number
  per_page: number
  last_page: number
}

export interface ListStudentsParams {
  page?: number
  per_page?: number
  sort?: 'name' | 'created_at'
  sort_dir?: 'asc' | 'desc'
  filter?: string
}

export interface CreateStudentDto {
  ra: string
  name: string
  email: string
  cpf: string
}

export interface UpdateStudentDto {
  name: string
  email: string
}
