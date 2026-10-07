import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/providers/trpc";
import PropertyCard from "@/components/PropertyCard";
import { Search, MapPin, Building2, TrendingUp, ArrowRight, CheckCircle2, Shield, Clock, Users } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("");
  const [searchType, setSearchType] = useState<"sale" | "rent" | "">("");

  const { data: featuredProperties, isLoading: featuredLoading } = trpc.property.listFeatured.useQuery();
  const { data: popularLocations } = trpc.location.popular.useQuery();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set("city", searchCity);
    if (searchType) params.set("listingType", searchType);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[520px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt="Cameroon real estate"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-emerald-600/90 text-white border-0 text-sm px-3 py-1">
            Cameroon's #1 Property Marketplace
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Find Your Perfect Property<br className="hidden md:block" /> in Cameroon
          </h1>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover homes, apartments, offices, and land for sale or rent across Douala, Yaoundé, Buea, and beyond.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="City (e.g. Douala, Yaoundé, Buea)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="pl-10 h-12 text-base"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={searchType === "rent" ? "default" : "outline"}
                  className={searchType === "rent" ? "bg-emerald-700 hover:bg-emerald-800 h-12 px-6" : "h-12 px-6"}
                  onClick={() => setSearchType(searchType === "rent" ? "" : "rent")}
                >
                  Rent
                </Button>
                <Button
                  variant={searchType === "sale" ? "default" : "outline"}
                  className={searchType === "sale" ? "bg-emerald-700 hover:bg-emerald-800 h-12 px-6" : "h-12 px-6"}
                  onClick={() => setSearchType(searchType === "sale" ? "" : "sale")}
                >
                  Buy
                </Button>
                <Button
                  className="bg-emerald-700 hover:bg-emerald-800 h-12 px-6"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">Search</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Douala", "Yaoundé", "Buea", "Bamenda", "Limbe"].map((city) => (
                <button
                  key={city}
                  onClick={() => setSearchCity(city)}
                  className="text-sm text-gray-500 hover:text-emerald-700 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-500 mt-1">Hand-picked listings by our team</p>
          </div>
          <Button
            variant="ghost"
            className="text-emerald-700 hover:text-emerald-800"
            onClick={() => navigate("/search")}
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : featuredProperties && featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Building2 className="h-12 w-12 mx-auto mb-3" />
            <p>No featured properties yet.</p>
          </div>
        )}
      </section>

      {/* Popular Locations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Locations</h2>
            <p className="text-gray-500 mt-2">Explore properties across Cameroon's top cities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularLocations?.map((loc) => (
              <Card
                key={loc.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm"
                onClick={() => navigate(`/search?city=${encodeURIComponent(loc.city)}`)}
              >
                <CardContent className="p-0">
                  <div className="h-32 bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-white/80" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{loc.displayName}</h3>
                    <p className="text-sm text-gray-500">{loc.listingCount} listings</p>
                  </div>
                </CardContent>
              </Card>
            )) ?? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA / How it Works */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-emerald-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Search & Filter</h3>
            <p className="text-gray-500 text-sm">Find properties by city, price, type, bedrooms, and more with our powerful search.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-emerald-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Listings</h3>
            <p className="text-gray-500 text-sm">We review every listing to reduce fraud and ensure accurate property information.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-emerald-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Directly</h3>
            <p className="text-gray-500 text-sm">Message owners and agents directly. No middlemen, no hidden fees.</p>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 bg-emerald-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-300" />
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-emerald-200">Properties Listed</p>
            </div>
            <div>
              <Users className="h-8 w-8 mx-auto mb-2 text-emerald-300" />
              <p className="text-3xl font-bold">2,000+</p>
              <p className="text-sm text-emerald-200">Happy Users</p>
            </div>
            <div>
              <Shield className="h-8 w-8 mx-auto mb-2 text-emerald-300" />
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm text-emerald-200">Secure Platform</p>
            </div>
            <div>
              <Clock className="h-8 w-8 mx-auto mb-2 text-emerald-300" />
              <p className="text-3xl font-bold">24h</p>
              <p className="text-sm text-emerald-200">Average Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 container mx-auto px-4">
        <div className="bg-emerald-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Have a property to list?</h2>
            <p className="text-gray-600 max-w-lg">
              List your property for free and reach thousands of potential buyers and renters across Cameroon.
            </p>
          </div>
          <Button
            className="bg-emerald-700 hover:bg-emerald-800 h-12 px-8 text-base shrink-0"
            onClick={() => navigate("/dashboard")}
          >
            List Your Property <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
