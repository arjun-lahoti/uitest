"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from 'next/link'


export type Job = {
	id: string
	name: string
	department: string
}

// Added column that contains a button to open a details page with a table listing all employees who have that job
// The button is a Link that routes the user to the detail page and passes the row's jobName as a parameter 
export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting:false,
  },
  {
    accessorKey: "department",
    header: "Department",
    enableSorting:false,
    enableGlobalFilter:false,
  },
  {
    accessorKey: "employees",
    header: "Employees",
    enableSorting:false,
    cell: ({ row }) => {
      return (
        <Link className="inline-block bg-primary text-white px-4 py-2 rounded-lg opacity-75 transition duration-200 ease-in-out hover:opacity-100"
          href={{
            pathname: '/detail',
            query: {
              jobName: row.getValue("name")
            }
          }}
        >
          View Employees
        </Link>
      )
    },

  },
]