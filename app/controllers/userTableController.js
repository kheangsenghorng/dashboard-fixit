// app/controllers/userTableController.js
import { toast } from "react-toastify";

export const createUserTableController = ({
  users,
  meta,
  setSelectedIds,
  fetchUsers,
  updateManyStatus,
  setSearchTerm,
  currentUser,
}) => {
  const resetSelection = () => setSelectedIds([]);

  // ✅ base params: admin sees all; others restricted to their role
  const baseParams = () => {
    if (!currentUser) return {};
    if (currentUser.role === "admin") return {};
    return { role: currentUser.role };
  };

  const fetchWithRole = (params = {}) => {
    return fetchUsers({ ...baseParams(), ...params });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > meta?.last_page) return;
    resetSelection();
    fetchWithRole({ page });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === users.length ? [] : users.map((u) => u.id)
    );
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (ids, status) => {
    if (!ids.length) return;
    try {
      await updateManyStatus({ ids, is_active: status });
      toast.success(status ? "Users activated" : "Users deactivated");
      resetSelection();
      fetchWithRole({ page: meta?.current_page || 1 });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleFilterInactive = async () => {
    await fetchWithRole({ page: 1, is_active: false });
    resetSelection();
  };

  const handleFilterActive = async () => {
    await fetchWithRole({ page: 1, is_active: true });
    resetSelection();
  };

  const handleClearFilter = async () => {
    await fetchWithRole({ page: 1 });
    resetSelection();
  };

  const handleSearchNameEmail = (value) => {
    setSearchTerm(value);
    fetchWithRole({ page: 1 });
  };

  return {
    handlePageChange,
    toggleSelectAll,
    toggleSelectOne,
    handleBulkStatusUpdate,
    handleFilterInactive,
    handleFilterActive,
    handleClearFilter,
    handleSearchNameEmail,
    resetSelection,
  };
};
