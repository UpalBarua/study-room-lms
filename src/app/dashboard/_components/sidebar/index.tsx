"use client";

import { IconCertificate, IconListDetails } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import CollapsibleMenu from "./collapsible-menu";

const dashboardNavLinks = [
  {
    label: "Listing",
    icon: IconListDetails,
    routes: [
      {
        label: "Departments",
        href: "/dashboard/departments",
      },
      {
        label: "Classes",
        href: "/dashboard/classes",
      },
      {
        label: "Subjects",
        href: "/dashboard/subjects",
      },
      {
        label: "Chapters",
        href: "/dashboard/chapters",
      },
    ],
  },
  {
    label: "Course & Content",
    icon: IconCertificate,
    routes: [
      {
        label: "Categories",
        href: "/dashboard/categories",
      },
      {
        label: "Subcategories",
        href: "/dashboard/subcategories",
      },
      {
        label: "Courses",
        href: "/dashboard/courses",
      },
      {
        label: "Lectures",
        href: "/dashboard/lectures",
      },
    ],
  },
];

export function DashboardSidebar() {
  return (
    <div>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarHeader className="flex-row items-center justify-between">
            <Link className="font-bold" href="/dashboard">
              <Image
                src="/images/logo.png"
                alt="logo"
                height={60}
                width={80}
                priority
              />
            </Link>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dashboardNavLinks.map((navLink) => (
                  <CollapsibleMenu key={navLink.label} {...navLink} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
