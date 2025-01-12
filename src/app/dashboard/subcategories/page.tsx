import { getSubcategories } from "@/actions/subcategories-actions";
import { DataTable } from "@/components/ui/data-table";
import { AddSubcategories } from "./_components/add-subcategory";
import { subcategorieColumns } from "./_components/subcategories-columns";

export default async function CategoriesPage() {
  const subcategories = await getSubcategories();

  return (
    <section className="pt-6">
      <div className="flex items-center justify-between pb-5">
        <h2 className="font-meidum text-xl">All Subcategories</h2>
        <AddSubcategories />
      </div>
      <DataTable columns={subcategorieColumns} data={subcategories} />
    </section>
  );
}
