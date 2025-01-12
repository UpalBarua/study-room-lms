"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteDepartmentAction } from "@/actions/department-actions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Class } from "@/types";
import { IconTrash } from "@tabler/icons-react";

type DeleteDepartmentProps = {
  currentDepartment: Class;
};

export function DeleteDepartment({
  currentDepartment,
}: Readonly<DeleteDepartmentProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const response = await deleteDepartmentAction({
        uuid: currentDepartment.uuid,
      });

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.message[0]);
      setIsOpen(false);
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button size="icon" variant="outline" onClick={() => setIsOpen(true)}>
        <IconTrash />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete "{currentDepartment.name}"?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onClick}>Continue</Button>
        </AlertDialogFooter>
        {isLoading && (
          <div className="absolute inset-0 z-[99] flex items-center justify-center rounded-[inherit] bg-background/50">
            <Spinner className="size-12" />
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
