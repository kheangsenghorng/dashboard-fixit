// userTableController.js
import { toast } from "react-toastify";

export const createUserTableController = ({
  users,
  meta,
  setSelectedIds,
  fetchUsers,
  deleteMany, // Ensure this is passed
  updateManyStatus,
  fetchFiltersIsActiveFalse,
  setSearchTerm,
}) => {
  const resetSelection = () => setSelectedIds([]);

  const handlePageChange = (page) => {
    if (page < 1 || page > meta?.last_page) return;
    resetSelection();
    fetchUsers({ page });
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
      fetchUsers({ page: meta?.current_page || 1 });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleFilterInactive = async () => {
    await fetchFiltersIsActiveFalse({ page: 1 });
    resetSelection();
  };

  const handleFilterActive = async () => {
    await fetchUsers({ page: 1, is_active: true });
    resetSelection();
  };

  const handleClearFilter = async () => {
    await fetchUsers({ page: 1 });
    resetSelection();
  };

  // Improved Search Logic: Removed the timeout from here. 
  // It's better to handle debouncing in the component or via a hook.
  const handleSearchNameEmail = (value) => {
    setSearchTerm(value);
    fetchUsers({ page: 1 }); 
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
    resetSelection, // Exported to use in component
  };
};