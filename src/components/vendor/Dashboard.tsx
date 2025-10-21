import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Users,
  Star,
  Bell,
  Settings,
  Menu,
  X,
  Hotel,
  Edit3,
  Eye,
  Plus,
  Filter,
  Search,
  MessageCircle,
  Clock,
  CheckCircle,
  Globe
} from 'lucide-react';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { useLogout } from '@/hooks/auth/useLogout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/userSlice';


interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  prefix?: string;
}


const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate  = useNavigate()
  const [notifications, setNotifications] = useState(5);
  const dispatch = useDispatch();
const {mutate : logout} = useLogout();
  const handleLogout = () =>{
    logout(undefined,{
        onSuccess : (response)=>{
            toast.success(`${response.message}`);
            dispatch(logoutUser());
            navigate("/vendor/login");
        },
        onError:(error : any)=>{
            toast.error(error)
        }
    })
  }

  // Sample data
  const revenueData = [
    { month: 'Jan', revenue: 45000, bookings: 120 },
    { month: 'Feb', revenue: 52000, bookings: 145 },
    { month: 'Mar', revenue: 48000, bookings: 130 },
    { month: 'Apr', revenue: 61000, bookings: 175 },
    { month: 'May', revenue: 58000, bookings: 160 },
    { month: 'Jun', revenue: 67000, bookings: 190 },
  ];

  const propertyData = [
    { type: 'Hotels', count: 15, revenue: 45000 },
    { type: 'Resorts', count: 8, revenue: 32000 },
    { type: 'Villas', count: 12, revenue: 28000 },
    { type: 'Apartments', count: 25, revenue: 35000 },
  ];

  const bookingStatusData = [
    { name: 'Confirmed', value: 65, color: '#10B981' },
    { name: 'Pending', value: 20, color: '#F59E0B' },
    { name: 'Cancelled', value: 15, color: '#EF4444' },
  ];

  const recentBookings = [
    { id: 1, guest: 'John Smith', property: 'Ocean View Hotel', checkin: '2024-07-15', amount: 1200, status: 'confirmed' },
    { id: 2, guest: 'Sarah Johnson', property: 'Mountain Resort', checkin: '2024-07-18', amount: 850, status: 'pending' },
    { id: 3, guest: 'Mike Davis', property: 'City Apartment', checkin: '2024-07-20', amount: 650, status: 'confirmed' },
    { id: 4, guest: 'Lisa Wilson', property: 'Beach Villa', checkin: '2024-07-22', amount: 1800, status: 'confirmed' },
    { id: 5, guest: 'Tom Brown', property: 'Luxury Suite', checkin: '2024-07-25', amount: 2200, status: 'pending' },
  ];

  const properties = [
    { id: 1, name: 'Ocean View Hotel', type: 'Hotel', location: 'Miami Beach', rating: 4.8, bookings: 45, revenue: 12500, image: '🏨' },
    { id: 2, name: 'Mountain Resort', type: 'Resort', location: 'Colorado', rating: 4.9, bookings: 32, revenue: 18200, image: '🏔️' },
    { id: 3, name: 'City Apartment', type: 'Apartment', location: 'New York', rating: 4.6, bookings: 28, revenue: 8900, image: '🏢' },
    { id: 4, name: 'Beach Villa', type: 'Villa', location: 'California', rating: 4.7, bookings: 22, revenue: 15600, image: '🏖️' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'properties', label: 'Properties', icon: Hotel },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const StatCard : React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color, prefix = '' }) => (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{prefix}{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </motion.div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="67,200" 
          change={12.5} 
          icon={DollarSign} 
          color="bg-green-500"
          prefix="$"
        />
        <StatCard 
          title="Total Bookings" 
          value="190" 
          change={8.3} 
          icon={Calendar} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Active Properties" 
          value="60" 
          change={5.1} 
          icon={Hotel} 
          color="bg-purple-500"
        />
        <StatCard 
          title="Avg Rating" 
          value="4.8" 
          change={2.1} 
          icon={Star} 
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Booking Status */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {bookingStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Guest</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Property</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Check-in</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">{booking.guest}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{booking.property}</td>
                  <td className="p-4 text-gray-600">{booking.checkin}</td>
                  <td className="p-4 font-medium">${booking.amount}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'confirmed' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
        <motion.button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span>Add Property</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search properties..." 
            className="border-0 focus:ring-0 p-0 text-sm"
          />
        </div>
        <button className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg text-sm">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <motion.div
            key={property.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl">
              {property.image}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{property.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm font-medium">{property.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{property.type} • {property.location}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  {property.bookings} bookings
                </div>
                <div className="text-sm font-medium text-green-600">
                  ${property.revenue}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center space-x-1">
                  <Eye size={16} />
                  <span>View</span>
                </button>
                <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center space-x-1">
                  <Edit3 size={16} />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'properties':
        return renderProperties();
      case 'bookings':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Bookings Management</h2>
            <p className="text-gray-600">Bookings management interface would be here...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics & Reports</h2>
            <p className="text-gray-600">Advanced analytics and reporting would be here...</p>
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Messages & Communication</h2>
            <p className="text-gray-600">Guest communication interface would be here...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <p className="text-gray-600">Account settings and preferences would be here...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Globe className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TravelVendor</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
                <p className="text-gray-600">Welcome back, John!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                className="relative p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={24} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">J</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Smith</p>
                  <p className="text-xs text-gray-500">Vendor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default VendorDashboard;