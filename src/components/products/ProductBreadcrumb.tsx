import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string; // Optional, jika tidak ada href berarti current page
}

interface ProductBreadcrumbProps {
    items: BreadcrumbItem[];
}

export function ProductBreadcrumb({ items }: ProductBreadcrumbProps) {
    return (
        <div className="border-b bg-muted/30">
            <div className="container mx-auto px-4 py-3">
                <nav className="flex items-center gap-2 text-sm">
                    {/* Home Link */}
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        <span>Beranda</span>
                    </Link>

                    {/* Dynamic Breadcrumb Items */}
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <div key={index} className="flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={
                                            isLast
                                                ? "text-foreground font-medium line-clamp-1"
                                                : "text-muted-foreground"
                                        }
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
