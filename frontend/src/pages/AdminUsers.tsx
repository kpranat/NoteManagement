import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import {
  Users,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Mail,
  FileText,
  Crown,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  note_count: number;
}

export default function AdminUsers() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate, page]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_BASE_URL}/admin/users?page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (userId === Number(user?.id)) {
      alert("You cannot change your own role!");
      return;
    }

    if (!confirm(`Are you sure you want to change this user's role to "${newRole}"?`)) {
      return;
    }

    setUpdatingUserId(userId);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user role");
      }

      // Update the user in the list
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );

      alert("User role updated successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Panel
        </button>

        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <p className="text-muted-foreground">
          View and manage user accounts and roles
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 p-4 rounded-lg border border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold">Total Users:</span>
          <span className="text-2xl font-bold">{users.length}</span>
          <span className="text-muted-foreground ml-2">
            (Page {page} of {totalPages})
          </span>
        </div>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((userItem) => (
            <div
              key={userItem.id}
              className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold truncate">
                      {userItem.username}
                    </h3>
                    {userItem.role === "admin" ? (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <ShieldCheck className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-600 dark:text-gray-400">
                        <Shield className="w-3 h-3" />
                        User
                      </span>
                    )}
                    {userItem.id === Number(user?.id) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        You
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{userItem.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{userItem.note_count} notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      <span>Joined {formatDate(userItem.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {userItem.id !== Number(user?.id) && (
                    <>
                      {userItem.role === "user" ? (
                        <button
                          onClick={() => handleRoleChange(userItem.id, "admin")}
                          disabled={updatingUserId === userItem.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingUserId === userItem.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-4 h-4" />
                          )}
                          Promote to Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(userItem.id, "user")}
                          disabled={updatingUserId === userItem.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingUserId === userItem.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                          Demote to User
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2 px-4 py-2">
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
