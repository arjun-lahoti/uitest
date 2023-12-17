"use client"

import { cn } from "@/lib/utils"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { PropsWithChildren, useState } from "react"

export type Employee = {
  id: string
  salary: number
  email: string
	name: string
	bonus: number
	job_title: string
	department: string
	start_date: string
	manager: string
	equity: number
}

// Added salary and bonus columns
// Enable sorting for name and salary columns, and filtering by name and job
// These properties were defaulted to true. They are set to false where needed
// Added bonus percentage column, which is initially hidden but swapped with bonus column on toggle

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting:false,
    enableGlobalFilter:false,
  },
	{
    accessorKey: "job_title",
    header: "Job",
    enableSorting:false,
  },
	{
    accessorKey: "department",
    header: "Department",
    enableSorting:false,
    enableGlobalFilter:false,
  },
	{
    accessorKey: "equity",
    header:  () => (<TextRightHeader>Equity</TextRightHeader>),
    enableSorting:false,
    enableGlobalFilter:false,
		cell: ({ row }) => {
      const equity = parseFloat(row.getValue("equity"))
			return getNumberCell(equity)
    },
  },
	{
    accessorKey: "manager",
    header: "Manager",
    enableSorting:false,
    enableGlobalFilter:false,
  },
	{
    accessorKey: "start_date",
    header: "Start Date",
    enableSorting:false,
    enableGlobalFilter:false,
  },
  {
    accessorKey: "salary",
    header:  () => (<TextRightHeader>Salary</TextRightHeader>),
    enableGlobalFilter:false,
		cell: ({ row }) => {
      const salary = parseFloat(row.getValue("salary"))
      return getDollarCell(salary)
    },
  },
  {
    accessorKey: "bonus",
    header:  () => (<TextRightHeader>Bonus</TextRightHeader>),
    enableSorting:false,
    enableGlobalFilter:false,
		cell: ({ row }) => {
      const bonus = parseFloat(row.getValue("bonus"))
      return getDollarCell(bonus)
      },
  },

  {
    accessorKey: "bonusPercentage",
    header:  () => (<TextRightHeader>Bonus</TextRightHeader>),
    enableSorting:false,
    enableGlobalFilter:false,
		cell: ({ row }) => {
      const salary = parseFloat(row.getValue("salary"))
      const bonus = parseFloat(row.getValue("bonus"))
      return getPercentCell(salary,bonus)
      },
  },
]


function TextRightHeader ({children, className} : PropsWithChildren<{className?: string}>) {
	return (<div className={cn(className, 'text-right')}>{children}</div>)
}

function getNumberCell(value: number) {
	const formatted = new Intl.NumberFormat("en-US").format(value)
	return <TextRightHeader className="font-medium">{formatted}</TextRightHeader>
}

// getDollarCell function returns html for dollar amount of a number value 
function getDollarCell(value: number){
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
  return <TextRightHeader className="font-medium">{formatted}</TextRightHeader>
}

// getPercentCell function returns html for percentage of a number value
function getPercentCell(salary: number, bonus: number) {
  const percentage = (bonus / salary);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(percentage); 
   return <TextRightHeader className="font-medium">{formatted}</TextRightHeader>;
}
