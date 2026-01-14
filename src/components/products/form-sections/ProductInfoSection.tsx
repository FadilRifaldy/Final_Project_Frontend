import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductInfoSectionProps {
    name: string;
    setName: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
}

export function ProductInfoSection({ name, setName, description, setDescription }: ProductInfoSectionProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                    id="name"
                    placeholder="e.g. iPhone 17 Pro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    placeholder="Describe the product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );
}
