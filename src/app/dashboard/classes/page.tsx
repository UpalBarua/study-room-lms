import { getClasses } from "@/actions/class-actions";
import { getLevels } from "@/actions/level";
import { DataTable } from "@/components/ui/data-table";
import { AddClass } from "./_components/add-class";
import { classColumns } from "./_components/class-columns";

export default async function ClassesPage() {
  const classes = await getClasses();
  const levels = await getLevels();

  return (
    <section className="pt-6">
      <div className="flex items-center justify-between pb-5">
        <h2 className="font-meidum text-xl">All Classes</h2>
        <AddClass levels={levels} />
      </div>
      <DataTable columns={classColumns} data={classes} />
    </section>
  );
}
