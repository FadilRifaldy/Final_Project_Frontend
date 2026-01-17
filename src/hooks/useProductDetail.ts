import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import getProducts, { getProductById, getVariantsByProductId } from "@/lib/helpers/product.backend";
import { getInventoryByVariant } from "@/lib/helpers/inventory.backend";
import { addToCart } from "@/lib/helpers/cart.backend";
import { IProduct, IProductVariant } from "@/types/product";
import { IStoreInventory } from "@/types/inventory";

/**
 * Custom hook untuk mengelola state dan logic halaman product detail
 * 
 * @param slug - Product slug dari URL parameter
 * @returns Object berisi product data, stock info, dan handler functions
 */
export function useProductDetail(slug: string) {
    // ==================== STATE MANAGEMENT ====================
    const [product, setProduct] = useState<IProduct | null>(null);
    const [variants, setVariants] = useState<IProductVariant[]>([]);
    const [selectedVariantId, setSelectedVariantId] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);

    // Multi-store inventory states
    const [storeInventories, setStoreInventories] = useState<IStoreInventory[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<string>("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const variantSlug = searchParams.get("variant");

    // ==================== HELPER FUNCTIONS ====================
    /**
     * Generate slug dari product name
     * Digunakan untuk matching product berdasarkan slug di URL
     */
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    // ==================== EFFECTS ====================

    /**
     * Effect 2: Fetch product data berdasarkan slug
     * - Fetch semua products dan cari yang match dengan slug
     * - Fetch full product details
     * - Fetch product variants
     */
    useEffect(() => {
        if (!slug) return;

        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null);

                // WORKAROUND: Backend belum punya slug field
                // Fetch semua products dan cari yang match dengan slug
                // TODO: Tambahkan slug field di Product model untuk better performance
                const productsResponse = await getProducts(1, 100);
                const matchedProduct = productsResponse.data.find(
                    (p: IProduct) => generateSlug(p.name) === slug
                );

                if (!matchedProduct) {
                    throw new Error("Product not found");
                }

                const productId = matchedProduct.id;

                // Fetch full product details
                const productData = await getProductById(productId);
                setProduct(productData);

                // Fetch variants dengan assignedImages
                const variantsData = await getVariantsByProductId(productId);

                if (variantsData && variantsData.length > 0) {
                    setVariants(variantsData);
                    
                    // Check if URL has variant param and it matches a variant
                    let preSelectedId = variantsData[0].id;
                    
                    if (variantSlug) {
                        const matchedVariant = variantsData.find(v => v.slug === variantSlug);
                        if (matchedVariant) {
                            preSelectedId = matchedVariant.id;
                        }
                    }

                    setSelectedVariantId(preSelectedId);
                } else {
                    setVariants([]);
                }
            } catch (err: any) {
                console.error("Error fetching product:", err);
                setError(err.message || "Gagal memuat produk");
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [slug, variantSlug]);

    /**
     * Effect 3: Fetch inventory across ALL stores saat variant berubah
     * Untuk multi-store availability display
     */
    useEffect(() => {
        if (!selectedVariantId) return;

        const fetchStoreInventories = async () => {
            try {
                const response = await getInventoryByVariant(selectedVariantId);

                // Debug: Log response
                console.log("Inventory Response:", response);
                console.log("Response data:", response.data);

                // Backend returns: { success, data: [...inventories], summary }
                // data is directly the inventories array
                if (response.success && response.data && Array.isArray(response.data)) {
                    setStoreInventories(response.data);

                    // Auto-select first available store (stock > reserved)
                    const firstAvailable = response.data.find(
                        (inv: any) => inv.quantity > inv.reserved
                    );

                    if (firstAvailable) {
                        setSelectedStoreId(firstAvailable.storeId);
                    } else {
                        setSelectedStoreId("");
                    }
                } else {
                    console.log("No inventories found or response not successful");
                    setStoreInventories([]);
                    setSelectedStoreId("");
                }
            } catch (err: any) {
                console.error("Error fetching store inventories:", err);
                setStoreInventories([]);
                setSelectedStoreId("");
            }
        };

        fetchStoreInventories();
    }, [selectedVariantId]);

    // Handlers
    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariantId || !selectedStoreId) {
            toast.error("Silakan pilih varian dan toko terlebih dahulu");
            return;
        }

        // Validate stock
        const selectedInventory = storeInventories.find(
            (inv) => inv.storeId === selectedStoreId
        );

        if (!selectedInventory) {
            toast.error("Toko tidak ditemukan");
            return;
        }

        const availableStock = selectedInventory.quantity - selectedInventory.reserved;
        
        if (availableStock < quantity) {
            toast.error(`Stok tidak mencukupi. Tersedia: ${availableStock}`);
            return;
        }

        try {
            setAddingToCart(true);
            
            const response = await addToCart(selectedVariantId, selectedStoreId, quantity);

            if (response.success) {
                toast.success("Produk berhasil ditambahkan ke keranjang!", {
                    action: {
                        label: "Lihat Keranjang",
                        onClick: () => router.push("/cart"),
                    },
                });
                
                // Dispatch event to update cart count in navbar
                window.dispatchEvent(new Event('cartUpdated'));
                
                // Reset quantity after successful add
                setQuantity(1);
            } else {
                toast.error(response.message || "Gagal menambahkan ke keranjang");
            }
        } catch (err: any) {
            console.error("Error adding to cart:", err);
            toast.error("Terjadi kesalahan saat menambahkan ke keranjang");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleVariantChange = (variantId: string) => {
        setSelectedVariantId(variantId);
    };

    // Computed values
    const selectedVariant = variants.find((v) => v.id === selectedVariantId);

    // Return value
    return {
        // Product Data
        product,
        variants,
        selectedVariant,
        selectedVariantId,

        // Stock & Inventory
        storeInventories,
        selectedStoreId,
        setSelectedStoreId,

        // Quantity
        quantity,
        setQuantity,

        // Loading & Error States
        loading,
        error,
        addingToCart,

        // Handlers
        handleQuantityChange,
        handleAddToCart,
        handleVariantChange,
        setSelectedVariantId,
    };
}
