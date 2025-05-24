'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import {
  Loader2,
  AlertTriangle,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package as PackageIcon, 
  ImageOff, 
} from 'lucide-react';
import { toast } from 'sonner'; 

// --- Interfaces ---
interface AdminPackageListItem {
  id: number;
  name: string;
  description?: string | null;
  duration: string;
  base_price: number;
  max_people?: number | null;
  images: string | string[] | null; 
  is_active: number; // 0 or 1
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

// --- Helper Components ---
const LoadingSpinner = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col justify-center items-center py-20 text-center">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
    <span className="text-lg text-gray-700">{text}</span>
  </div>
);

const InfoCard = ({ title, children, className = '', icon: Icon }: { title?: string, children: React.ReactNode, className?: string, icon?: React.ElementType }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
    {title && (
      <div className="flex items-center mb-4">
        {Icon && <Icon className="h-6 w-6 text-blue-600 mr-3" />}
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <InfoCard title="Error" icon={AlertTriangle} className="bg-red-50 border-l-4 border-red-400 text-red-700">
    <p>{message}</p>
  </InfoCard>
);

// --- Package Card Component ---
const PackageCard = ({
  pkg,
  onDelete,
  onToggleActive,
  isDeleting,
  isTogglingStatus,
}: {
  pkg: AdminPackageListItem;
  onDelete: (packageId: number) => void;
  onToggleActive: (packageId: number, currentStatus: boolean) => void;
  isDeleting: boolean;
  isTogglingStatus: boolean;
}) => {
  let imageUrl: string | null = null;
  if (pkg.images) {
    try {
      const parsedImages = typeof pkg.images === 'string' ? JSON.parse(pkg.images) : pkg.images;
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        imageUrl = parsedImages[0];
      } else if (typeof parsedImages === 'string') {
        imageUrl = parsedImages; 
      }
    } catch (e) {
      console.warn('Failed to parse package images:', e);
      if (typeof pkg.images === 'string' && (pkg.images.startsWith('http') || pkg.images.startsWith('/'))) { 
        imageUrl = pkg.images; 
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
      {imageUrl ? (
        <img src={imageUrl} alt={pkg.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
          <ImageOff size={48} />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={pkg.name}>
          {pkg.name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">Duration: {pkg.duration}</p>
        <p className="text-sm text-gray-600 mb-3">Price: ${pkg.base_price.toFixed(2)}</p>

        <div className="mb-4 mt-auto">
          <button
            onClick={() => onToggleActive(pkg.id, !!pkg.is_active)}
            disabled={isTogglingStatus}
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors disabled:opacity-60 disabled:cursor-wait ${pkg.is_active
                ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
                : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
              }`}
            title={pkg.is_active ? "Deactivate Package" : "Activate Package"}
          >
            {isTogglingStatus ? <Loader2 size={14} className="animate-spin mr-1.5" /> : (pkg.is_active ? <Eye size={14} className="mr-1.5" /> : <EyeOff size={14} className="mr-1.5" />)}
            {pkg.is_active ? 'Active' : 'Inactive'}
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <Link
            href={`/admin_packages/${pkg.id}/edit`} // Corrected Link
            className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-md hover:bg-indigo-50 transition-colors"
            title="Edit Package"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={() => onDelete(pkg.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-wait"
            title="Delete Package"
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Admin Packages Page Component ---
function AdminPackagesPageContent() {
  const [packages, setPackages] = useState<AdminPackageListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPackageId, setDeletingPackageId] = useState<number | null>(null);
  const [togglingStatusPackageId, setTogglingStatusPackageId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); 

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/packages`); 
        if (!response.ok) {
          const errorData = await response.json() as { message?: string };
          throw new Error(errorData.message || `Failed to fetch packages: ${response.statusText}`);
        }
        const result: ApiResponse<{ packages: AdminPackageListItem[]; pagination?: any }> = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data.packages)) {
          setPackages(result.data.packages);
        } else if (result.success && Array.isArray(result.data)) { 
          setPackages(result.data as unknown as AdminPackageListItem[]);
        }
        else {
           throw new Error(result.message || result.error || 'Failed to retrieve packages data in expected format.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast.error('Failed to load packages: ' + errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleDeletePackage = async (packageId: number) => {
    if (!window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }
    setDeletingPackageId(packageId);
    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'DELETE',
      });
      const result: ApiResponse<null> = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || 'Package deactivated successfully.');
        setPackages((prevPackages) => prevPackages.filter((p) => p.id !== packageId));
      } else {
        throw new Error(result.message || result.error || 'Failed to delete package.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast.error('Error deleting package: ' + errorMessage);
      console.error('Error deleting package:', err);
    } finally {
      setDeletingPackageId(null);
    }
  };
  
  const handleToggleActiveStatus = async (packageId: number, currentStatus: boolean) => {
    setTogglingStatusPackageId(packageId);
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`/api/admin/packages/${packageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: newStatus }),
      });
      const result: ApiResponse<{ is_active: boolean }> = await response.json();

      if (response.ok && result.success) {
        toast.success(`Package ${newStatus ? 'activated' : 'deactivated'} successfully.`);
        setPackages((prevPackages) =>
          prevPackages.map((p) =>
            p.id === packageId ? { ...p, is_active: newStatus ? 1 : 0 } : p
          )
        );
      } else {
        throw new Error(result.message || result.error || 'Failed to update package status.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast.error('Error updating status: ' + errorMessage);
      console.error('Error updating package status:', err);
    } finally {
      setTogglingStatusPackageId(null);
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading Packages..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Packages</h1>
        <Link
          href="/admin_packages/new" // Corrected Link
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle size={18} className="mr-2" /> Add New Package
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search packages by name or description..."
          className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPackages.length === 0 ? (
        <InfoCard className="text-center">
          <div className="py-8">
            <PackageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              {packages.length > 0 && searchTerm ? 'No packages match your search.' : 'No packages found.'}
            </p>
            {!(packages.length > 0 && searchTerm) && (
              <p className="text-gray-400 text-sm mt-1">
                Click &quot;Add New Package&quot; to create one.
              </p>
            )}
          </div>
        </InfoCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onDelete={handleDeletePackage}
              onToggleActive={handleToggleActiveStatus}
              isDeleting={deletingPackageId === pkg.id}
              isTogglingStatus={togglingStatusPackageId === pkg.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPackagesPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading Page..." />}>
      <AdminPackagesPageContent />
    </Suspense>
  );
}
