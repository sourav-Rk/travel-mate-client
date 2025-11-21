import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyPosts } from "@/hooks/volunteer-post/useVolunteerPost";
import { useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification";
import { useDeleteVolunteerPost } from "@/hooks/volunteer-post/useVolunteerPost";
import { useClientAuth } from "@/hooks/auth/useAuth";
import Pagination from "@/components/Pagination";
import { Plus, Loader2} from "lucide-react";
import toast from "react-hot-toast";
import type { PostStatus } from "@/types/volunteer-post";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

export function MyPosts() {
  const navigate = useNavigate();
  const { isLoggedIn } = useClientAuth();
  const { data: profile } = useLocalGuideProfileQuery(isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");

  const { data, isLoading } = useMyPosts(
    profile?._id || "",
    {
      page,
      limit: 10,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
    !!profile?._id
  );

  const { mutateAsync: deletePost } = useDeleteVolunteerPost();

  const handleEdit = (postId: string) => {
    navigate(`/pvt/posts/edit/${postId}`);
  };

  const handleDelete = (postId: string) => {
  setSelectedPostId(postId);
  setIsModalOpen(true);
  };

const handleConfirmDelete = async () => {
  if (!selectedPostId) return;

  setIsDeleting(true);

  try {
    const response = await deletePost(selectedPostId);
    toast.success(response.message);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to delete post");
  } finally {
    setIsDeleting(false);
    setIsModalOpen(false);
    setSelectedPostId(null);
  }
};


  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">You need to be a verified local guide to create posts</p>
        <Button
          onClick={() => navigate("/pvt/local-guide/verification")}
          className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white"
        >
          Become a Local Guide
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#2CA4BC]" />
      </div>
    );
  }

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.currentPage || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Posts</h1>
          <p className="text-slate-600">
            Manage your volunteer posts and share your local knowledge
          </p>
        </div>
        <Button
          onClick={() => navigate("/pvt/posts/create")}
          className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Filter by Status:</label>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as PostStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48 border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Total Posts</p>
          <p className="text-2xl font-bold text-[#1a5f6b]">{total}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {posts.filter((p) => p.status === "published").length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">
            {posts.filter((p) => p.status === "draft").length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Total Views</p>
          <p className="text-2xl font-bold text-[#2CA4BC]">
            {posts.reduce((sum, p) => sum + p.views, 0)}
          </p>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-600 text-lg mb-2">No posts found</p>
          <p className="text-slate-500 text-sm mb-4">
            {statusFilter !== "all"
              ? `You don't have any ${statusFilter} posts`
              : "Create your first post to share your local knowledge"}
          </p>
          <Button
            onClick={() => navigate("/pvt/posts/create")}
            className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <PostCard
              key={post._id}
              post={post}
              index={index}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
/>

    </div>
  );
}












