import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: string;
    pricePeriod: string;
    listingType: string;
    city: string;
    neighborhood?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    areaSqm?: string | null;
    images: { url: string; isPrimary?: number | null }[];
    isVerified?: number | null;
    isFeatured?: number | null;
    propertyType: string;
  };
  showFavorite?: boolean;
}

function formatPrice(price: string, period: string, type: string) {
  const num = Number(price);
  const formatted = num.toLocaleString("en-CM", { maximumFractionDigits: 0 });
  const suffix = type === "rent" ? (period === "monthly" ? "/mo" : "/yr") : "";
  return `XAF ${formatted}${suffix}`;
}

export default function PropertyCard({ property, showFavorite = true }: PropertyCardProps) {
  const utils = trpc.useUtils();
  const { data: isFav } = trpc.favorite.check.useQuery(
    { propertyId: property.id },
    { enabled: showFavorite }
  );
  const addFav = trpc.favorite.add.useMutation({
    onSuccess: () => utils.favorite.check.invalidate({ propertyId: property.id }),
  });
  const removeFav = trpc.favorite.remove.useMutation({
    onSuccess: () => utils.favorite.check.invalidate({ propertyId: property.id }),
  });

  const primaryImage = property.images?.find((i) => i.isPrimary === 1)?.url || property.images?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop";

  const typeLabel = property.listingType === "rent" ? "For Rent" : "For Sale";
  const typeColor = property.listingType === "rent" ? "bg-blue-600" : "bg-emerald-600";

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`${typeColor} text-white text-xs font-medium border-0`}>{typeLabel}</Badge>
          {property.isVerified ? (
            <Badge variant="secondary" className="bg-white/90 text-emerald-700 text-xs font-medium">
              Verified
            </Badge>
          ) : null}
          {property.isFeatured ? (
            <Badge variant="secondary" className="bg-amber-400/90 text-amber-900 text-xs font-medium">
              Featured
            </Badge>
          ) : null}
        </div>
        {showFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isFav) removeFav.mutate({ propertyId: property.id });
              else addFav.mutate({ propertyId: property.id });
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-white font-bold text-lg">
            {formatPrice(property.price, property.pricePeriod, property.listingType)}
          </p>
        </div>
      </div>
      <Link to={`/property/${property.id}`}>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-emerald-700 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">
              {property.neighborhood ? `${property.neighborhood}, ` : ""}
              {property.city}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {(property.bedrooms ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4 text-gray-400" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {(property.bathrooms ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4 text-gray-400" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.areaSqm && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4 text-gray-400" />
                <span>{property.areaSqm} m²</span>
              </div>
            )}
            <Badge variant="outline" className="ml-auto text-xs capitalize">
              {property.propertyType}
            </Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
