import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";


export function TripPackageHeader({
  packageId,
  packageName,
  title,
  startDate,
  endDate,
  meetingPoint,
  status,
  isLoading
}: {
  packageId: string;
  packageName: string;
  title: string;
  startDate: string;
  endDate: string;
  meetingPoint: string;
  status: string;
  isLoading:boolean
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "applications_closed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const navigate = useNavigate();
   
  if(isLoading){
    return <div>Loading package Details</div>
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Button
              onClick={() => navigate("/vendor/packages")}
              variant="ghost"
              size="sm"
              className="hover:bg-white/80 border border-slate-300 transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Package Management
            </Button>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              {packageName}
            </CardTitle>
            <p className="text-lg text-gray-700 font-medium">{title}</p>
            <p className="text-lg text-gray-700 font-medium">{packageId}</p>
          </div>
          <Badge
            className={`${getStatusColor(
              status
            )} px-3 py-1 text-sm font-medium`}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
            <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Trip Duration</p>
              <p className="text-sm text-gray-600">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
            <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Meeting Point</p>
              <p className="text-sm text-gray-600">{meetingPoint}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
