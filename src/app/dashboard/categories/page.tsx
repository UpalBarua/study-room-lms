import { getCategories } from "@/actions/categories-actions";
import { DataTable } from "@/components/ui/data-table";
import { AddCategories } from "./_components/add-category";
import { categorieColumns } from "./_components/categories-columns";

export default async function CategoriesPage() {
  const categoris = await getCategories();

  return (
    <section className="pt-6">
      <div className="flex items-center justify-between pb-5">
        <h2 className="font-meidum text-xl">All Classes</h2>
        <AddCategories />
      </div>
      <DataTable columns={categorieColumns} data={categoris} />
    </section>
  );
}
