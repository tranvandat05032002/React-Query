import { Students } from "types/students.type";
import http from "utils/http";

export const getStudents = (page: Number | string, limit: Number | String) => 
  http.get<Students>('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })