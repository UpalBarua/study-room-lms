"use client";

import { IconChevronDown, IconPoint } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type CollapsibleMenuProps = {
  label: string;
  icon: React.ComponentType;
  routes: {
    label: string;
    href: string;
  }[];
};

export default function CollapsibleMenu({
  label,
  icon: Icon,
  routes,
}: Readonly<CollapsibleMenuProps>) {
  const pathname = usePathname();

  return (
    <Collapsible key={label} defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <Icon />
            {label}
            <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {routes.map(({ href, label }) => (
              <SidebarMenuSubItem key={href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(href)}>
                  <Link className="flex items-center gap-x-1" href={href}>
                    <span>
                      <IconPoint stroke={1} />
                    </span>
                    {label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
