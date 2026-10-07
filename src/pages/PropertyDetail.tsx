import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import PropertyCard from "@/components/PropertyCard";
import {
  Bed, Bath, Square, MapPin, Phone, Mail, Heart, Share2,
  AlertTriangle, CheckCircle2, ArrowLeft, Home, Car, Dog,
  Droplets, Zap, Send, Loader2, Shield, Calendar, Eye
} from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const propertyId = Number(id);

  const { data: property, isLoading } = trpc.property.getById.useQuery({ id: propertyId });
  const { data: similarProperties } = trpc.property.similar.useQuery(
    { propertyId, city: property?.city ?? "" },
    { enabled: !!property?.city }
  );
  const { data: isFav } = trpc.favorite.check.useQuery(
    { propertyId },
    { enabled: isAuthenticated }
  );

  const addFav = trpc.favorite.add.useMutation({
    onSuccess: () => toast({ title: "Added to favorites" }),
  });
  const removeFav = trpc.favorite.remove.useMutation({
    onSuccess: () => toast({ title: "Removed from favorites" }),
  });
  const sendInquiry = trpc.inquiry.create.useMutation({
    onSuccess: () => {
      toast({ title: "Message sent successfully!" });
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
    },
  });
  const submitReport = trpc.admin.submitReport.useMutation({
    onSuccess: () => toast({ title: "Report submitted. Thank you!" }),
  });

  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [activeImage, setActiveImage] = useState(0);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState<"spam" | "fraud" | "wrong_info" | "sold" | "other">("other");
  const [reportDetails, setReportDetails] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Property not found</h2>
          <Button className="mt-4" onClick={() => navigate("/search")}>Browse Properties</Button>
        </div>
      </div>
    );
  }

  const images = property.images ?? [];
  const primaryImage = images[activeImage]?.url || images[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop";

  const formatPrice = (price: string, period: string, type: string) => {
    const num = Number(price);
    const formatted = num.toLocaleString("en-CM", { maximumFractionDigits: 0 });
    const suffix = type === "rent" ? (period === "monthly" ? "/mo" : "/yr") : "";
    return `XAF ${formatted}${suffix}`;
  };

  const amenities = property.amenities ? JSON.parse(property.amenities as string) as string[] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={primaryImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 ${
                        i === activeImage ? "border-emerald-600" : "border-transparent"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl p-6 border">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge className={property.listingType === "rent" ? "bg-blue-600" : "bg-emerald-600"}>
                      For {property.listingType === "rent" ? "Rent" : "Sale"}
                    </Badge>
                    {property.isVerified ? <Badge variant="secondary" className="text-emerald-700"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge> : null}
                    {property.isFeatured ? <Badge variant="secondary" className="text-amber-700 bg-amber-100">Featured</Badge> : null}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
                  <div className="flex items-center gap-1 text-gray-500 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {property.address || `${property.neighborhood ? property.neighborhood + ", " : ""}${property.city}, ${property.region}`}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                    {formatPrice(property.price, property.pricePeriod, property.listingType)}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1 justify-end">
                    <Eye className="h-4 w-4" />
                    <span>{property.viewCount ?? 0} views</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 py-4 border-y">
                {(property.bedrooms ?? 0) > 0 && (
                  <div className="text-center">
                    <Bed className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                    <p className="font-semibold">{property.bedrooms}</p>
                    <p className="text-xs text-gray-500">Beds</p>
                  </div>
                )}
                {(property.bathrooms ?? 0) > 0 && (
                  <div className="text-center">
                    <Bath className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                    <p className="font-semibold">{property.bathrooms}</p>
                    <p className="text-xs text-gray-500">Baths</p>
                  </div>
                )}
                {property.areaSqm && (
                  <div className="text-center">
                    <Square className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                    <p className="font-semibold">{property.areaSqm}</p>
                    <p className="text-xs text-gray-500">m²</p>
                  </div>
                )}
                <div className="text-center">
                  <Home className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                  <p className="font-semibold capitalize">{property.propertyType}</p>
                  <p className="text-xs text-gray-500">Type</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-5 w-5 mx-auto text-gray-400 mb-1" />
                  <p className="font-semibold">{new Date(property.createdAt).toLocaleDateString("en-CM", { month: "short", year: "numeric" })}</p>
                  <p className="text-xs text-gray-500">Listed</p>
                </div>
              </div>

              <Tabs defaultValue="description" className="mt-6">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {property.description || "No description provided."}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className={property.parking ? "text-gray-700" : "text-gray-400"}>
                        {property.parking ? "Parking available" : "No parking"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Dog className="h-4 w-4 text-gray-400" />
                      <span className={property.petFriendly ? "text-gray-700" : "text-gray-400"}>
                        {property.petFriendly ? "Pet friendly" : "No pets"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4 text-gray-400" />
                      <span className={property.waterAvailable ? "text-gray-700" : "text-gray-400"}>
                        {property.waterAvailable ? "Water available" : "No water"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-gray-400" />
                      <span className={property.electricityAvailable ? "text-gray-700" : "text-gray-400"}>
                        {property.electricityAvailable ? "Electricity" : "No electricity"}
                      </span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="amenities" className="mt-4">
                  {amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((a) => (
                        <Badge key={a} variant="secondary" className="text-sm px-3 py-1">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                          {a}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No amenities listed.</p>
                  )}
                </TabsContent>
                <TabsContent value="location" className="mt-4">
                  <div className="aspect-video bg-emerald-50 rounded-lg flex items-center justify-center border">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-emerald-300 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">{property.city}, {property.region}</p>
                      {property.neighborhood && <p className="text-gray-500 text-sm">{property.neighborhood}</p>}
                      {property.landmark && <p className="text-gray-500 text-sm mt-1">Near: {property.landmark}</p>}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Similar Properties */}
            {similarProperties && similarProperties.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Properties in {property.city}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarProperties.slice(0, 4).map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Agent Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Agent / Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {property.owner?.name?.charAt(0) ?? "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{property.owner?.name ?? "Agent"}</p>
                    {property.owner?.isVerifiedAgent ? (
                      <Badge variant="secondary" className="text-emerald-700 text-xs">
                        <Shield className="h-3 w-3 mr-1" /> Verified Agent
                      </Badge>
                    ) : null}
                  </div>
                </div>
                {property.contactPhone && (
                  <a href={`tel:${property.contactPhone}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                      {property.contactPhone}
                    </Button>
                  </a>
                )}
                {property.contactEmail && (
                  <a href={`mailto:${property.contactEmail}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2 text-emerald-600" />
                      {property.contactEmail}
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Inquiry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Send a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm">Name</Label>
                  <Input
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label className="text-sm">Email</Label>
                  <Input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label className="text-sm">Phone</Label>
                  <Input
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+237 6 XX XX XX XX"
                  />
                </div>
                <div>
                  <Label className="text-sm">Message</Label>
                  <Textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="I am interested in this property..."
                    rows={3}
                  />
                </div>
                <Button
                  className="w-full bg-emerald-700 hover:bg-emerald-800"
                  disabled={sendInquiry.isPending || !inquiryForm.name || !inquiryForm.email || !inquiryForm.message}
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast({ title: "Please sign in to send a message", variant: "destructive" });
                      return;
                    }
                    sendInquiry.mutate({
                      propertyId,
                      ownerId: property.ownerId,
                      ...inquiryForm,
                    });
                  }}
                >
                  {sendInquiry.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              {isAuthenticated && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (isFav) removeFav.mutate({ propertyId });
                    else addFav.mutate({ propertyId });
                  }}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  {isFav ? "Saved" : "Save"}
                </Button>
              )}
              <Button variant="outline" className="flex-1" onClick={() => {}}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>

            {/* Report */}
            <div className="pt-2">
              {!showReportForm ? (
                <button
                  onClick={() => setShowReportForm(true)}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <AlertTriangle className="h-4 w-4" /> Report this listing
                </button>
              ) : (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-900">Why are you reporting?</p>
                    <div className="flex flex-wrap gap-2">
                      {(["spam", "fraud", "wrong_info", "sold", "other"] as const).map((r) => (
                        <Badge
                          key={r}
                          variant={reportReason === r ? "default" : "outline"}
                          className="cursor-pointer text-xs capitalize"
                          onClick={() => setReportReason(r)}
                        >
                          {r.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Additional details..."
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        disabled={submitReport.isPending}
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast({ title: "Please sign in to report", variant: "destructive" });
                            return;
                          }
                          submitReport.mutate({ propertyId, reason: reportReason, details: reportDetails });
                          setShowReportForm(false);
                        }}
                      >
                        Submit Report
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowReportForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
