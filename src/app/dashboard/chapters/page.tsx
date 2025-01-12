import { DataTable } from "@/components/ui/data-table";
import { access_token, api } from "@/data/api";
import type { Level, Subject } from "@/types";
import { chapterColumns } from "./_components/chapter-columns";
import { AddChapter } from "./_components/add-chapter";

async function getChapters(): Promise<Subject[]> {
  const response = await fetch(`${api}/admin/chapter`, {
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
  const chapters = await getChapters();
  const levels = await getLevels();

  return (
    <section className="pt-6">
      <div className="flex items-center justify-between pb-5">
        <h2 className="font-meidum text-xl">All Chapters</h2>
        <AddChapter levels={levels} />
      </div>
      <DataTable columns={chapterColumns} data={chapters} />
    </section>
  );
}
