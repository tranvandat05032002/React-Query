import { Student, Students } from "types/students.type";
import http from "utils/http";

export const getStudents = (page: Number | string, limit: Number | String) => 
  http.get<Students>('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })
export const getStudent = (id: Number | String) => http.get(`students/${id}`)
export const addStudent = (student: Omit<Student, 'id'>) => http.post<Student>('/students', student)
export const updateStudent = (id: Number | String, student: Student) => http.put<Student>(`/students/${id}`, student)