"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";


// Added imports for sorting, filtering, and visibility 
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react";
import { Input } from '../components/ui/input';


export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}


export function DataTable<TData, TValue>({
	columns,
	data,
  }: DataTableProps<TData, TValue>) {

	// Created state variables to store the sorting, filtering, and column visibility states of the table 
	const [sorting, setSorting] = useState<SortingState>([])
	const [filtering, setFiltering] = useState("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({bonusPercentage:false})

	// Added table state configuration and callbacks for neccessary sorting, filtering, and visibility functions
	const table = useReactTable({
	  data,
	  columns,
	  state: {
		sorting,
		globalFilter: filtering,
		columnVisibility
	  },
	  onSortingChange: setSorting,
	  onGlobalFilterChange: setFiltering,
	  onColumnVisibilityChange: setColumnVisibility,
	  getCoreRowModel: getCoreRowModel(),
	  getSortedRowModel: getSortedRowModel(),
	  getFilteredRowModel: getFilteredRowModel(),
	});



  return (
	
    <div className="rounded-md border-y overflow-auto h-[63vh] w-[90vw] relative scroll-auto">

		{/* Added input field to data table. As user types it sets the filtering state */}
		<div className = "grid gap-1 w-[30vw] mb-4 mt-4">
		 <Input
              id="filter"
              placeholder="Filter by name or job..."
              autoCapitalize="none"
              autoCorrect="off"
			  value = {filtering}
			  onChange = {(event) => setFiltering(event.target.value)}
            />
		</div>
		<Table>
			<TableHeader className='sticky top-0 z-10'>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow className='border-b-1' key={headerGroup.id}>
						{headerGroup.headers.map((header, index) => {
							return (
								<TableHead
									key={header.id}
									className={`${index === 0 ? 'sticky left-0' : ''} bg-secondary`}
								>
									{header.isPlaceholder ? null : (
									<div>
										{/* Dropdown menu to toggle ascending or descending sort for all sortable columns */}
										{header.column.getCanSort() ? (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<div className="hover:text-primary cursor-pointer select-none">
													{flexRender(header.column.columnDef.header, header.getContext())}
													</div>
												</DropdownMenuTrigger>
												<DropdownMenuContent className={cn('w-40 border', 'ml-6')}>
													<DropdownMenuGroup>
														<DropdownMenuItem onClick={() => {
															header.column.toggleSorting(false)
														}}>
														Sort in ascending order
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => {
														header.column.toggleSorting(true)
														}}>
														Sort in descending order
														</DropdownMenuItem>
													</DropdownMenuGroup>
												</DropdownMenuContent>
											</DropdownMenu>
										) :
										/* Dropdown menu to toggle bonus as either percent or dollar amount */
										header.column.id === 'bonus' ? (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<div className="hover:text-primary cursor-pointer select-none">
													{flexRender(header.column.columnDef.header, header.getContext())}
													</div>
												</DropdownMenuTrigger>
												<DropdownMenuContent 
													className={cn(
													"w-40 border",
													'ml-6')}>
													<DropdownMenuGroup>
														<DropdownMenuItem onClick={() => {
															const isVisible = header.column.getIsVisible();
															setColumnVisibility((prev) => ({
																...prev,
																bonus: !isVisible,
																bonusPercentage: isVisible,
															}));
														}}>
															View percentage
														</DropdownMenuItem>
													</DropdownMenuGroup>
												</DropdownMenuContent>
											</DropdownMenu>
											
										) : header.column.id === 'bonusPercentage' ? (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
												<div className="hover:text-primary cursor-pointer select-none">
												{flexRender(header.column.columnDef.header, header.getContext())}
												</div>
												</DropdownMenuTrigger>
												<DropdownMenuContent 
													className={cn(
														"w-40 border",
														'ml-6')}>
													<DropdownMenuGroup>
														<DropdownMenuItem onClick={() => {
															const isVisible = header.column.getIsVisible();
															setColumnVisibility((prev) => ({
																...prev,
																bonus: isVisible,
																bonusPercentage: !isVisible,
															}));
														}}>
															View dollar amount
														</DropdownMenuItem>
													</DropdownMenuGroup>
												</DropdownMenuContent>
											</DropdownMenu>
										) : (
										flexRender(header.column.columnDef.header, header.getContext())
										)}
										
									</div>
									)}
								</TableHead>
							)
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}
						>
							{row.getVisibleCells().map((cell, index) => 
							{
								return (
									<TableCell 
										key={cell.id}
										className={`${index === 0 ? 'sticky left-0' : ''} bg-white`}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								)})}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
    </div>
  )
}
