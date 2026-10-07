import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_PATH } from "@/const";
import PropertyCard from "@/components/PropertyCard";
import { Heart, Loader2, ArrowRight } from "lucide-react";

export default function Favorites() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: LOGIN_PATH });

  const { data: favorites, isLoading } = trpc.favorite.list.useQuery(undefined, { enabled: isAuthenticated });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-500 mb-6">Properties you've saved</p>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <PropertyCard
                key={fav.id}
                property={{
                  id: fav.property.id,
                  title: fav.property.title,
                  price: fav.property.price,
                  pricePeriod: fav.property.pricePeriod,
                  listingType: fav.property.listingType,
                  city: fav.property.city,
                  neighborhood: fav.property.neighborhood,
                  bedrooms: fav.property.bedrooms,
                  bathrooms: fav.property.bathrooms,
                  areaSqm: fav.property.areaSqm,
                  images: fav.property.images,
                  isVerified: fav.property.isVerified,
                  isFeatured: fav.property.isFeatured,
                  propertyType: fav.property.propertyType,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">Save properties you like to find them easily later.</p>
            <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/search")}>
              Browse Properties <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
