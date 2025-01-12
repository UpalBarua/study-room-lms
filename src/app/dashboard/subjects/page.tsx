import { getSubjects } from "@/actions/subject-actions";
import { DataTable } from "@/components/ui/data-table";
import { access_token, api } from "@/data/api";
import type { Level } from "@/types";
import { AddSubject } from "./_components/add-subject";
import { subjectColumns } from "./_components/subject-columns";

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
  const subjects = await getSubjects();
  const levels = await getLevels();

  return (
    <section className="pt-6">
      <div className="flex items-center justify-between pb-5">
        <h2 className="font-meidum text-xl">All Subjects</h2>
        <AddSubject levels={levels} />
      </div>
      <DataTable columns={subjectColumns} data={subjects} />
    </section>
  );
}
