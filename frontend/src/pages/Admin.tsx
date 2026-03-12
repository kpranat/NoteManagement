import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Activity, 
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";

interface AdminStats {
  users: {
    total: number;
    admins: number;
    regular_users: number;
    premium_active: number;
  };
  notes: {
    total: number;
    average_per_user: number;
  };
  premium_access: {
    total_accesses: number;
  };
  ai_usage: {
    total_requests: number;
  };
}

interface UserCount {
  total_users: number;
  admin_users: number;
  regular_users: number;
  premium_users: number;
  free_users: number;
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userCount, setUserCount] = useState<UserCount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (!isLoading && !isAdmin) {
      navigate("/dashboard");
      return;
    }

    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, navigate]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      // Fetch user count
      const userCountResponse = await fetch(`${API_BASE_URL}/admin/users/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userCountResponse.ok) {
        throw new Error("Failed to fetch user count");
      }

      const userCountData = await userCountResponse.json();
      setUserCount(userCountData);

      // Fetch admin stats
      const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch admin statistics");
      }

      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin && !isLoading) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          System overview and management dashboard
        </p>
      </div>

      {/* User Statistics */}
      {userCount && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Users"
              value={userCount.total_users}
              icon={<Users className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              title="Admin Users"
              value={userCount.admin_users}
              icon={<ShieldCheck className="w-5 h-5" />}
              color="purple"
            />
            <StatCard
              title="Regular Users"
              value={userCount.regular_users}
              icon={<Users className="w-5 h-5" />}
              color="gray"
            />
            <StatCard
              title="Premium Users"
              value={userCount.premium_users}
              icon={<TrendingUp className="w-5 h-5" />}
              color="green"
            />
            <StatCard
              title="Free Users"
              value={userCount.free_users}
              icon={<Users className="w-5 h-5" />}
              color="orange"
            />
          </div>
        </div>
      )}

      {/* System Statistics */}
      {stats && (
        <div>
          <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Notes"
              value={stats.notes.total}
              icon={<FileText className="w-5 h-5" />}
              color="blue"
              subtitle={`${stats.notes.average_per_user} avg per user`}
            />
            <StatCard
              title="Active Premium"
              value={stats.users.premium_active}
              icon={<TrendingUp className="w-5 h-5" />}
              color="green"
              subtitle="Active subscribers"
            />
            <StatCard
              title="Premium Accesses"
              value={stats.premium_access.total_accesses}
              icon={<Activity className="w-5 h-5" />}
              color="purple"
              subtitle="Total premium content views"
            />
            <StatCard
              title="AI Requests"
              value={stats.ai_usage.total_requests}
              icon={<Activity className="w-5 h-5" />}
              color="pink"
              subtitle="Total AI feature usage"
            />
          </div>
        </div>
      )}

      {/* Admin Actions */}
      <div className="mt-8 p-6 rounded-lg border border-border bg-secondary/30">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard
            title="View All Notes"
            description="Browse and manage notes from all users"
            buttonText="View Notes"
            onClick={() => navigate("/admin/notes")}
          />
          <ActionCard
            title="User Management"
            description="View and manage user accounts and roles"
            buttonText="Manage Users"
            onClick={() => navigate("/admin/users")}
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange" | "gray" | "pink";
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    gray: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  };

  return (
    <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value.toLocaleString()}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

function ActionCard({ title, description, buttonText, onClick }: ActionCardProps) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
      >
        {buttonText}
      </button>
    </div>
  );
}
