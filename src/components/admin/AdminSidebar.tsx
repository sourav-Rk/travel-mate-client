import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  MapPin, 
  FileText, 
  Wallet, 
  Award, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useLogout } from '@/hooks/auth/useLogout';
import { logoutAdmin } from '@/services/auth/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogout } from '@/store/slices/adminSlice';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {mutate : logoutAdminMutate} = useLogout(logoutAdmin);
  const handleLogout = ()=>{
    logoutAdminMutate(undefined,{
      onSuccess :(response) =>{
        toast.success(`${response.message}`);
        dispatch(adminLogout())
        navigate("/admin")
      },
      onError : (error : any) =>{
        toast.error(error)
      }
    })
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/ad_pvt' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/ad_pvt/users' },
    { id: 'vendors', label: 'Vendor Management', icon: Store, path: '/admin/ad_pvt/vendors' },
    { id: 'trips', label: 'Trips', icon: MapPin, path: '/trips' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet' },
    { id: 'badges', label: 'Badges', icon: Award, path: '/badges' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
  ];

  const handleItemClick = (itemId: string,path:string): void => {
    setActiveItem(itemId);
    navigate(path)
    setIsOpen(false); // Close mobile menu on item click
  };

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-2xl font-bold text-black">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">Management Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id,item.path)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Icon
                  size={20}
                  className={`mr-3 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-black'
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <LogOut size={20} className="mr-3 text-red-500 group-hover:text-red-700" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;