import { DataTable } from "@/components/ui/data-table";
import { access_token, api } from "@/data/api";
import type { Department, Level } from "@/types";
import { AddDepartment } from "./_components/add-department";
import { departmentColumns } from "./_components/department-columns";

async function getDepartments(): Promise<Department[]> {
  const response = await fetch(`${api}/admin/department`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.data;
}

async function getLevels(): Promise<Level[]> {
  const response = await fetch(`${api}/fetch/level`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.data;
}

export default async function ClassesPage() {
  const departments = await getDepartments();
  const levels = await getLevels();

  return (
    <section className="pt-6">
      <div className="flex items-center justify-between pb-5">
        <h2 className="font-meidum text-xl">All Departments</h2>
        <AddDepartment levels={levels} />
      </div>
      <DataTable columns={departmentColumns} data={departments} />
    </section>
  );
}
