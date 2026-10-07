import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/providers/trpc";
import PropertyCard from "@/components/PropertyCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<{
    listingType: "sale" | "rent" | "";
    propertyType: "apartment" | "house" | "villa" | "land" | "commercial" | "office" | "studio" | "";
    city: string;
    region: string;
    neighborhood: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    bedrooms: number | undefined;
    bathrooms: number | undefined;
    furnished: number | undefined;
    parking: number | undefined;
    petFriendly: number | undefined;
    waterAvailable: number | undefined;
    electricityAvailable: number | undefined;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({
    listingType: (searchParams.get("listingType") as "sale" | "rent" | "") || "",
    propertyType: (searchParams.get("propertyType") as "apartment" | "house" | "villa" | "land" | "commercial" | "office" | "studio" | "") || "",
    city: (searchParams.get("city") as string) || "",
    region: searchParams.get("region") || "",
    neighborhood: searchParams.get("neighborhood") || "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    bathrooms: searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined,
    furnished: searchParams.get("furnished") === "1" ? 1 : undefined,
    parking: searchParams.get("parking") === "1" ? 1 : undefined,
    petFriendly: searchParams.get("petFriendly") === "1" ? 1 : undefined,
    waterAvailable: searchParams.get("waterAvailable") === "1" ? 1 : undefined,
    electricityAvailable: searchParams.get("electricityAvailable") === "1" ? 1 : undefined,
    sortBy: searchParams.get("sortBy") || "date",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  });

  const [page, setPage] = useState(0);
  const limit = 12;

  const { data, isLoading } = trpc.property.search.useQuery({
    ...filters,
    listingType: filters.listingType || undefined,
    propertyType: filters.propertyType || undefined,
    city: filters.city || undefined,
    region: filters.region || undefined,
    neighborhood: filters.neighborhood || undefined,
    limit,
    offset: page * limit,
  });

  const { data: cities } = trpc.location.cities.useQuery();

  useEffect(() => {
    setPage(0);
  }, [filters]);

  const updateFilter = <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (["sortBy", "sortOrder"].includes(k)) return false;
    return v !== undefined && v !== "";
  }).length;

  const clearFilters = () => {
    setFilters({
      listingType: "",
      propertyType: "",
      city: "",
      region: "",
      neighborhood: "",
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      furnished: undefined,
      parking: undefined,
      petFriendly: undefined,
      waterAvailable: undefined,
      electricityAvailable: undefined,
      sortBy: "date",
      sortOrder: "desc",
    });
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-medium mb-2 block">Transaction</Label>
        <div className="flex gap-2">
          <Button
            variant={filters.listingType === "rent" ? "default" : "outline"}
            size="sm"
            className={filters.listingType === "rent" ? "bg-emerald-700" : ""}
            onClick={() => updateFilter("listingType", filters.listingType === "rent" ? "" : "rent")}
          >
            Rent
          </Button>
          <Button
            variant={filters.listingType === "sale" ? "default" : "outline"}
            size="sm"
            className={filters.listingType === "sale" ? "bg-emerald-700" : ""}
            onClick={() => updateFilter("listingType", filters.listingType === "sale" ? "" : "sale")}
          >
            Buy
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Property Type</Label>
        <Select value={filters.propertyType} onValueChange={(v) => updateFilter("propertyType", v as typeof filters.propertyType)}>
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any type</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">City</Label>
        <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any city</SelectItem>
            {cities?.map((c) => (
              <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>
            )) ?? [
              "Douala", "Yaoundé", "Buea", "Bamenda", "Bafoussam", "Limbe", "Garoua", "Maroua"
            ].map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Bedrooms</Label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              variant={filters.bedrooms === n ? "default" : "outline"}
              size="sm"
              className={filters.bedrooms === n ? "bg-emerald-700" : ""}
              onClick={() => updateFilter("bedrooms", filters.bedrooms === n ? undefined : n)}
            >
              {n}+
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Bathrooms</Label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((n) => (
            <Button
              key={n}
              variant={filters.bathrooms === n ? "default" : "outline"}
              size="sm"
              className={filters.bathrooms === n ? "bg-emerald-700" : ""}
              onClick={() => updateFilter("bathrooms", filters.bathrooms === n ? undefined : n)}
            >
              {n}+
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Price Range (XAF)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Features</Label>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Furnished</span>
          <Switch checked={!!filters.furnished} onCheckedChange={(v) => updateFilter("furnished", v ? 1 : undefined)} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Parking</span>
          <Switch checked={!!filters.parking} onCheckedChange={(v) => updateFilter("parking", v ? 1 : undefined)} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Pet Friendly</span>
          <Switch checked={!!filters.petFriendly} onCheckedChange={(v) => updateFilter("petFriendly", v ? 1 : undefined)} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Water Available</span>
          <Switch checked={!!filters.waterAvailable} onCheckedChange={(v) => updateFilter("waterAvailable", v ? 1 : undefined)} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Electricity</span>
          <Switch checked={!!filters.electricityAvailable} onCheckedChange={(v) => updateFilter("electricityAvailable", v ? 1 : undefined)} />
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="h-4 w-4 mr-2" /> Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Properties</h1>
            <p className="text-gray-500 text-sm">
              {data?.total ?? 0} results found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(v) => {
                const [sortBy, sortOrder] = v.split("-") as [string, "asc" | "desc"];
                updateFilter("sortBy", sortBy);
                updateFilter("sortOrder", sortOrder);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop filters sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-20 bg-white rounded-xl border p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">{activeFilterCount}</Badge>
                )}
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : data?.items && data.items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.items.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                {/* Pagination */}
                <div className="flex justify-center items-center gap-3 mt-10">
                  <Button
                    variant="outline"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page + 1} of {Math.max(1, Math.ceil((data.total || 0) / limit))}
                  </span>
                  <Button
                    variant="outline"
                    disabled={(page + 1) * limit >= (data.total || 0)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria.</p>
                <Button onClick={clearFilters} variant="outline">
                  <X className="h-4 w-4 mr-2" /> Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
