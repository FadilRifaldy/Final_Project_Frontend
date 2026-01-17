import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import { getAvailableCities } from "@/lib/helpers/search.backend";
import { toast } from "sonner";

interface BrowseProduct {
    id: string;
    name: string;
    description?: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    images: Array<{
        id: string;
        imageUrl: string;
        order: number;
    }>;
    variants: Array<{
        id: string;
        slug: string;
        price: number;
        isActive: boolean;
    }>;
    storeName?: string;
    storeCity?: string;
    storeId?: string;
    availableStock?: number;
    lowestPrice?: number;
}

interface BrowseStore {
    id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    phone?: string;
    totalProducts?: number;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export function useBrowseData() {
    // ==================== URL PARAMS ====================
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchQuery = searchParams.get('q') || '';
    const cityParam = searchParams.get('city') || '';
    const storeIdParam = searchParams.get('store') || '';

    // ==================== STATE MANAGEMENT ====================

    // Data States
    const [products, setProducts] = useState<BrowseProduct[]>([]);
    const [stores, setStores] = useState<BrowseStore[]>([]);

    // UI States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');

    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState(searchQuery); // For Input (UI)
    const [executedSearchTerm, setExecutedSearchTerm] = useState(searchQuery); // For API Fetch
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>(cityParam || '');
    const [citiesLoading, setCitiesLoading] = useState(true);

    // Pagination States
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
    });

    // ==================== HELPER FUNCTIONS ====================

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // ==================== EFFECTS ====================

    useEffect(() => {
        const loadCities = async () => {
            try {
                setCitiesLoading(true);
                const cities = await getAvailableCities();
                setAvailableCities(cities);

                if (!selectedCity && cities.length > 0) {
                    // Try to get user's city from localStorage (nearest_store is most reliable as it matches our DB)
                    let foundCity = "";

                    try {
                        const cachedStore = localStorage.getItem("nearest_store");
                        const cachedLocation = localStorage.getItem("user_location");
                        
                        let cityToMatch = "";
                        if (cachedStore) {
                            cityToMatch = JSON.parse(cachedStore).city;
                        } else if (cachedLocation) {
                            cityToMatch = JSON.parse(cachedLocation).city;
                        }

                        if (cityToMatch) {
                            // Robust matching: find city in our list (case-insensitive)
                            const match = cities.find(c => 
                                c.toLowerCase() === cityToMatch.toLowerCase() || 
                                c.toLowerCase().includes(cityToMatch.toLowerCase()) ||
                                cityToMatch.toLowerCase().includes(c.toLowerCase())
                            );

                            if (match) {
                                foundCity = match;
                                console.log("📍 Found matching city in DB:", foundCity);
                            }
                        }
                    } catch (err) {
                        console.error("Error matching user city:", err);
                    }

                    setSelectedCity(foundCity || cities[0]);
                }
            } catch (err: any) {
                console.error('Error loading cities:', err);
                toast.error('Gagal memuat daftar kota');
                setError(err.message || 'Gagal memuat daftar kota');
            } finally {
                setCitiesLoading(false);
            }
        };

        loadCities();
    }, []); // Run once on mount

    // Unified Sync Effect: Watch all relevant URL params
    useEffect(() => {
        // Sync Search Term
        if (searchQuery !== executedSearchTerm) {
            setExecutedSearchTerm(searchQuery);
            setSearchTerm(searchQuery);
        }
        
        // Sync City
        if (cityParam && cityParam !== selectedCity) {
            setSelectedCity(cityParam);
        }

        // Reset page on search/filter change
        setPage(1);
    }, [searchQuery, cityParam]);

    useEffect(() => {
        if (!citiesLoading && selectedCity) {
            fetchData();
        }
    }, [citiesLoading, selectedCity, executedSearchTerm, activeTab, page, storeIdParam]);

    const fetchData = async () => {
        if (!selectedCity) return;

        try {
            setLoading(true);
            setError(null);

            if (activeTab === 'products') {
                await fetchProducts();
            } else {
                await fetchStores();
            }
        } catch (err: any) {
            console.error('Error fetching data:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        const response = await api.get('/search/products', {
            params: {
                search: executedSearchTerm.trim() || undefined,
                city: selectedCity,
                storeId: storeIdParam || undefined,
                page,
                limit: 20,
            },
        });

        if (response.data.success) {
            setProducts(response.data.data);
            setPagination(response.data.pagination);
        } else {
            throw new Error(response.data.message || 'Gagal memuat produk');
        }
    };

    const fetchStores = async () => {
        const response = await api.get('/search/stores', {
            params: {
                search: executedSearchTerm.trim() || undefined,
                city: selectedCity,
                page,
                limit: 20,
            },
        });

        if (response.data.success) {
            setStores(response.data.data);
            setPagination(response.data.pagination);
        } else {
            throw new Error(response.data.message || 'Gagal memuat toko');
        }
    };

    // ==================== HANDLERS ====================

    const handleSearch = () => {
        setPage(1); // Reset to first page
        setExecutedSearchTerm(searchTerm);
        
        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm.trim()) {
            params.set('q', searchTerm.trim());
        } else {
            params.delete('q');
        }
        router.push(`/browse?${params.toString()}`);
        
        // No need to call fetchData() explicitly as useEffect will trigger since executedSearchTerm changed
        // But if value same, useEffect won't trigger, so we might need strict equality check or just rely on react state.
        // Actually if term is same, re-fetching is maybe redundant unless we want to force refresh? 
        // Let's rely on dependency array. If `page` set to 1, effectively it updates state?
        // If page was already 1 and term SAME, no fetch. That's fine.
    };

    const handleCityChange = (newCity: string) => {
        setSelectedCity(newCity);
        setPage(1); // Reset to first page

        // Update URL with city parameter
        const params = new URLSearchParams(searchParams.toString());
        params.set('city', newCity);
        if (executedSearchTerm) params.set('q', executedSearchTerm); // Use currently executed term
        router.push(`/browse?${params.toString()}`);
    };

    const handleTabChange = (tab: 'products' | 'stores') => {
        setActiveTab(tab);
        setPage(1); // Reset to first page
    };

    const handleLoadMore = () => {
        if (pagination.hasNext) {
            setPage(prev => prev + 1);
        }
    };

    const handleReset = () => {
        setSearchTerm('');
        setExecutedSearchTerm('');
        setPage(1);
        
        // Clean URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        router.push(`/browse?${params.toString()}`);
    };

    // ==================== COMPUTED VALUES ====================

    const hasMore = pagination.hasNext;
    const totalItems = pagination.totalItems;
    const isEmpty = !loading && totalItems === 0;

    // ==================== RETURN VALUE ====================

    return {
        // Data
        products,
        stores,

        // UI States
        loading,
        error,
        citiesLoading,
        activeTab,

        // Search & Filter
        searchTerm,
        setSearchTerm,
        availableCities,
        selectedCity,

        // Pagination
        page,
        pagination,
        hasMore,
        totalItems,
        isEmpty,

        // Handlers
        handleSearch,
        handleCityChange,
        handleTabChange,
        handleLoadMore,
        handleReset,
        setPage,

        // Utilities
        generateSlug,
        formatPrice,
    };
}
