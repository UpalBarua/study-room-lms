"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((link, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLastLink = index + 1 === paths.length;

          return (
            <Fragment key={link}>
              <BreadcrumbItem>
                {isLastLink ? (
                  <BreadcrumbPage className="capitalize">{link}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="capitalize" asChild>
                    <Link href={href}>{link}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastLink && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
