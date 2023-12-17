import { DataTable } from "@/components/data-table"
import { columns } from "../job/columns"
import { supabaseUtils } from "@/lib/utils"
import { Database } from "@/types/supabase"
import { deprecate } from "util"
import { cookies } from "next/headers"

type JobTable = Database['public']['Tables']['jobs']['Row']
type JoinedJob = JobTable & {
  departments: {
    id: string,
    name: string
  }
}

async function getJobData() {
  const supabase = supabaseUtils.createServerClient(cookies())
  const { data, error } = await supabase.from("jobs").select("id, name, departments(id, name)").returns<JoinedJob[]>()
  if (error || !data) {
    console.error(error)
    return []
  }
  return data.map(job => ({
    id: job.id,
    name: job.name,
    department: job.departments.name
  }))
}


export default async function JobPage() {
  const data = await getJobData()

  return (
    <div className="flex overflow-hidden justify-center">
      <DataTable columns={columns} data={data} />
    </div>
  )
}