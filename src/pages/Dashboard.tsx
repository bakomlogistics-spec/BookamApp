import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_PATH } from "@/const";
import {
  Plus, Building2, Eye, Trash2, Loader2, Bed, Bath, MapPin, DollarSign,
  Inbox, ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: LOGIN_PATH });

  const utils = trpc.useUtils();
  const { data: myListings, isLoading: listingsLoading } = trpc.property.listByOwner.useQuery(undefined, { enabled: isAuthenticated });
  const { data: inquiries } = trpc.inquiry.listReceived.useQuery(undefined, { enabled: isAuthenticated });
  const createProperty = trpc.property.create.useMutation({
    onSuccess: () => {
      toast({ title: "Property listed successfully!" });
      utils.property.listByOwner.invalidate();
      setShowCreate(false);
      setFormData(initialForm);
    },
  });
  const deleteProperty = trpc.property.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Property deleted" });
      utils.property.listByOwner.invalidate();
    },
  });

  const [showCreate, setShowCreate] = useState(false);
  const initialForm = {
    title: "", description: "", price: "", pricePeriod: "one_time" as const, listingType: "sale" as const,
    propertyType: "apartment" as const, bedrooms: 0, bathrooms: 0, areaSqm: "",
    furnished: 0, parking: 0, petFriendly: 0, waterAvailable: 1, electricityAvailable: 1,
    region: "", city: "", neighborhood: "", landmark: "", address: "",
    amenities: [] as string[], contactPhone: "", contactEmail: "",
  };
  const [formData, setFormData] = useState(initialForm);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const statusColor: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    sold: "bg-blue-100 text-blue-700",
    rented: "bg-purple-100 text-purple-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage your listings and inquiries</p>
          </div>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-700 hover:bg-emerald-800">
                <Plus className="h-4 w-4 mr-2" /> List Property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>List a New Property</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="md:col-span-2">
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Modern 3-Bedroom Apartment" />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label>Price (XAF)</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="450000" />
                </div>
                <div>
                  <Label>Price Period</Label>
                  <Select value={formData.pricePeriod} onValueChange={(v) => setFormData({ ...formData, pricePeriod: v as typeof formData.pricePeriod })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_time">One-time</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Listing Type</Label>
                  <Select value={formData.listingType} onValueChange={(v) => setFormData({ ...formData, listingType: v as typeof formData.listingType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(v) => setFormData({ ...formData, propertyType: v as typeof formData.propertyType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
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
                  <Label>Bedrooms</Label>
                  <Input type="number" value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Bathrooms</Label>
                  <Input type="number" value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Area (m²)</Label>
                  <Input value={formData.areaSqm} onChange={(e) => setFormData({ ...formData, areaSqm: e.target.value })} placeholder="145" />
                </div>
                <div>
                  <Label>Region</Label>
                  <Input value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} placeholder="Littoral" />
                </div>
                <div>
                  <Label>City</Label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Douala" />
                </div>
                <div>
                  <Label>Neighborhood</Label>
                  <Input value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} placeholder="Bonapriso" />
                </div>
                <div>
                  <Label>Landmark</Label>
                  <Input value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} placeholder="Near Casino" />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} placeholder="+237 6 XX XX XX XX" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} placeholder="agent@example.com" />
                </div>
              </div>
              <Button
                className="w-full bg-emerald-700 hover:bg-emerald-800"
                disabled={createProperty.isPending || !formData.title || !formData.price || !formData.city || !formData.region}
                onClick={() => createProperty.mutate(formData)}
              >
                {createProperty.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Submit Listing
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="listings">
          <TabsList className="mb-6">
            <TabsTrigger value="listings">
              <Building2 className="h-4 w-4 mr-2" /> My Listings ({myListings?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="inquiries">
              <Inbox className="h-4 w-4 mr-2" /> Inquiries ({inquiries?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {listingsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : myListings && myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={property.images?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <Badge className={`absolute top-2 left-2 ${statusColor[property.status] || "bg-gray-100 text-gray-700"}`}>
                        {property.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {property.city}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-3">
                        <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {property.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.bathrooms}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {Number(property.price).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/property/${property.id}`)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm("Delete this listing?")) deleteProperty.mutate({ id: property.id });
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-500 mb-6">List your first property to get started.</p>
                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => setShowCreate(true)}>
                  <Plus className="h-4 w-4 mr-2" /> List Property
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inquiries">
            {inquiries && inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <Card key={inq.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{inq.name}</p>
                          <p className="text-sm text-gray-500">{inq.email} {inq.phone && `· ${inq.phone}`}</p>
                          <p className="text-sm text-gray-700 mt-2">{inq.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {inq.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/property/${inq.propertyId}`)}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Inbox className="h-12 w-12 mx-auto mb-3" />
                <p>No inquiries yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
