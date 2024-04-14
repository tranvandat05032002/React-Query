import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'api/students.api'
import React from 'react'
import { Link } from 'react-router-dom'
import { useQueryString } from 'utils/useQueryString'
import classNames from "classnames"
const LIMIT = 10;
export default function Students() {
  const queryString: { page?: Number } = useQueryString();
  const page = Number(queryString.page) || 1;
  const queryClient = useQueryClient();
  const studentsQuery = useQuery({
    queryKey: ["student", page],
    queryFn: ({ signal }) => getStudents(page, LIMIT, signal),
    staleTime: 60 * 1000, //60s
    gcTime: 61 * 1000,
    placeholderData: keepPreviousData
  })
  const deleteStudentMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: (_, id) => {
      alert(`Delete student id ${id} success!`)
      queryClient.invalidateQueries({
        queryKey: ["student", page],
        exact: true
      })
    }
  })
  const handlePrefetchDataStudent = (id: Number) => {
    //  queryClient.prefetchQuery({
    //   queryKey: ["student", String(id)],
    //   queryFn: () => getStudent(id),
    //   staleTime: 10 * 1000, // 10s
    //   gcTime: 11 * 1000 // 11s remove in cache 
    // })
  }
  const handleDeleteStudent = (id: number) => {
    deleteStudentMutation.mutate(id)
  }
  const handleFetchStudentId = (second: number) => {
    queryClient.prefetchQuery({
      queryKey: ["student", "11"],
      queryFn: () => getStudent(11),
      staleTime: second * 1000, // 10s
    })
  }
  const handleRefreshStudent = () => {
    studentsQuery.refetch();
  }
  const handleCancelStudent = () => {
    queryClient.cancelQueries({
      queryKey: ['student', page]
    })
  }
  const totalStudentsCount = Number(studentsQuery.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentsCount / LIMIT)
  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div className="mt-4">
        <Link to={'/students/add'} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add</Link>
      </div>
      <div className="mt-2"><button className="text-white bg-blue-500 px-5 py-2.5 rounded-lg" onClick={() => handleFetchStudentId(10)}>10S</button></div>
      <div className="mt-2"><button className="text-white bg-blue-500 px-5 py-2.5 rounded-lg" onClick={() => handleFetchStudentId(2)}>2S</button></div>
      <div className="mt-2"><button className="text-white bg-blue-500 px-5 py-2.5 rounded-lg" onClick={handleRefreshStudent}>Refresh Student</button></div>
      <div className="mt-2"><button className="text-white bg-pink-300 px-5 py-2.5 rounded-lg" onClick={handleCancelStudent}>cancel Request Student</button></div>
      {studentsQuery.isLoading && (<div role='status' className='mt-6 animate-pulse'>
        <div className='h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
        <div className='h-10 bg-gray-200 rounded dark:bg-gray-700' />
        <span className='sr-only'>Loading...</span>
      </div>)}
      {!studentsQuery.isLoading &&
        <React.Fragment>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    #
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Avatar
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Email
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsQuery.data?.data.map((student) =>
                  <tr
                    key={student.id}
                    onMouseEnter={() => handlePrefetchDataStudent(student.id)}
                    className='bg-white border-b hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                    <td className='px-6 py-4'>{student.id}</td>
                    <td className='px-6 py-4'>
                      <img
                        src={student.avatar}
                        alt='student'
                        className='w-5 h-5'
                      />
                    </td>
                    <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='px-6 py-4'>{student.email}</td>
                    <td className='px-6 py-4 text-right'>
                      <Link to={`/students/${student.id}`} className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'>
                        Edit
                      </Link>
                      <button className='font-medium text-red-600 dark:text-red-500' onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>

          <div className='flex justify-center mt-6'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  <span className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg cursor-not-allowed hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                    Previous
                  </span>
                </li>
                {Array(totalPage).fill(0).map((_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === page;
                  return (
                    <li key={pageNumber}>
                      <Link
                        className={classNames('px-3 py-2 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700',
                          {
                            'bg-gray-100 text-gray-700': isActive,
                            'bg-white text-gray-500': !isActive
                          }

                        )}
                        to={`/students?page=${pageNumber}`}
                      >
                        {pageNumber}
                      </Link>
                    </li>
                  )
                }
                )}
                {/* <li>
                  <a
                    className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                    href='/students?page=8'
                  >
                    1
                  </a>
                </li> */}
                <li>
                  <a
                    className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    href='/students?page=1'
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </React.Fragment>
      }
    </div>
  )
}
