import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_PATH } from "@/const";
import {
  Shield, Users, Building2, AlertTriangle, CheckCircle2, XCircle,
  Loader2, Eye, Trash2, Star, UserCheck, ArrowRight
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: LOGIN_PATH });

  if (!authLoading && isAuthenticated && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">You need admin privileges to view this page.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const utils = trpc.useUtils();
  const { data: stats } = trpc.admin.stats.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: allListings, isLoading: listingsLoading } = trpc.admin.listings.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: allUsers } = trpc.admin.users.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: allReports } = trpc.admin.reports.useQuery(undefined, { enabled: user?.role === "admin" });

  const updateStatus = trpc.admin.updateListingStatus.useMutation({
    onSuccess: () => {
      toast({ title: "Listing updated" });
      utils.admin.listings.invalidate();
      utils.admin.stats.invalidate();
    },
  });
  const deleteListing = trpc.admin.deleteListing.useMutation({
    onSuccess: () => {
      toast({ title: "Listing deleted" });
      utils.admin.listings.invalidate();
      utils.admin.stats.invalidate();
    },
  });
  const updateReport = trpc.admin.updateReport.useMutation({
    onSuccess: () => {
      toast({ title: "Report updated" });
      utils.admin.reports.invalidate();
      utils.admin.stats.invalidate();
    },
  });
  const verifyAgent = trpc.admin.verifyAgent.useMutation({
    onSuccess: () => {
      toast({ title: "Agent verification updated" });
      utils.admin.users.invalidate();
    },
  });

  const statusColor: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    sold: "bg-blue-100 text-blue-700",
    rented: "bg-purple-100 text-purple-700",
    rejected: "bg-red-100 text-red-700",
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage listings, users, and reports</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Properties</p>
              <p className="text-2xl font-bold">{stats?.totalProperties ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Users</p>
              <p className="text-2xl font-bold">{stats?.totalUsers ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{stats?.pendingListings ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-2xl font-bold">{stats?.featuredListings ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Verified</p>
              <p className="text-2xl font-bold">{stats?.verifiedListings ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Reports</p>
              <p className="text-2xl font-bold">{stats?.openReports ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings">
          <TabsList className="mb-6">
            <TabsTrigger value="listings">
              <Building2 className="h-4 w-4 mr-2" /> Listings
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="reports">
              <AlertTriangle className="h-4 w-4 mr-2" /> Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {listingsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : allListings && allListings.length > 0 ? (
              <div className="space-y-3">
                {allListings.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{property.title}</h3>
                          <Badge className={statusColor[property.status] || "bg-gray-100 text-gray-700"}>
                            {property.status}
                          </Badge>
                          {property.isFeatured ? <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : null}
                        </div>
                        <p className="text-sm text-gray-500">{property.city}, {property.region} · XAF {Number(property.price).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: property.id, status: "available", isVerified: 1 })}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: property.id, status: "rejected" })}
                        >
                          <XCircle className="h-4 w-4 mr-1 text-red-600" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => {
                            if (confirm("Delete this listing?")) deleteListing.mutate({ id: property.id });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Building2 className="h-12 w-12 mx-auto mb-3" />
                <p>No listings found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="users">
            {allUsers && allUsers.length > 0 ? (
              <div className="space-y-3">
                {allUsers.map((u) => (
                  <Card key={u.id}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">
                          {u.name?.charAt(0) ?? "U"}
                        </div>
                        <div>
                          <p className="font-medium">{u.name ?? "Unknown"}</p>
                          <p className="text-sm text-gray-500">{u.email} · {u.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={u.isVerifiedAgent ? "default" : "outline"} className={u.isVerifiedAgent ? "bg-emerald-700" : ""}>
                          <UserCheck className="h-3 w-3 mr-1" />
                          {u.isVerifiedAgent ? "Verified Agent" : "Not Verified"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verifyAgent.mutate({ id: u.id, verified: !u.isVerifiedAgent })}
                        >
                          {u.isVerifiedAgent ? "Unverify" : "Verify"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3" />
                <p>No users found.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports">
            {allReports && allReports.length > 0 ? (
              <div className="space-y-3">
                {allReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={report.status === "open" ? "destructive" : "secondary"}>
                              {report.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{report.reason.replace("_", " ")}</Badge>
                          </div>
                          <p className="font-medium">{report.property?.title ?? "Property"}</p>
                          <p className="text-sm text-gray-500">Reported by {report.reporter?.name ?? "Anonymous"}</p>
                          {report.details && <p className="text-sm text-gray-700 mt-1">{report.details}</p>}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReport.mutate({ id: report.id, status: "resolved" })}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" /> Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReport.mutate({ id: report.id, status: "dismissed" })}
                          >
                            <XCircle className="h-4 w-4 mr-1 text-gray-600" /> Dismiss
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/property/${report.propertyId}`)}>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
                <p>No reports found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
