"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Define breadcrumb item type
type BreadcrumbItem = {
    label: string;
    href: string;
    isLast?: boolean;
};

export default function DynamicBreadcrumb() {
    const pathname = usePathname();

    // Generate breadcrumb items from pathname
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const paths = pathname.split("/").filter((path) => path);

        const breadcrumbs: BreadcrumbItem[] = [
            { label: "Home", href: "/", isLast: false },
        ];

        let currentPath = "";
        paths.forEach((path, index) => {
            currentPath += `/${path}`;

            // Format label: capitalize and replace hyphens with spaces
            const label = path
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            breadcrumbs.push({
                label,
                href: currentPath,
                isLast: index === paths.length - 1,
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                        <BreadcrumbItem>
                            {crumb.isLast ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={crumb.href}>
                                        {crumb.label}
                                    </Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {!crumb.isLast && (
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
