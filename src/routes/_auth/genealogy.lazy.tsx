import { createLazyFileRoute } from "@tanstack/react-router";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { GenealogyFilters } from "../../components/genealogy/GenealogyFilters";
import { GenealogyTree } from "../../components/genealogy/GenealogyTree";
import { useUserData, useUserByIdData } from "../../features/auth/useUserData";
import { UserInfoModal } from "../../components/common/UserInfoModal";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/_auth/genealogy")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchUserId, setSearchUserId] = useState<string | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: currentUserData,
    isLoading: isLoadCurrent,
    isError: isErrCurrent,
    error: errCurrent,
  } = useUserData();

  const {
    data: searchUserData,
    isLoading: isLoadSearch,
    isError: isErrSearch,
    error: errSearch,
  } = useUserByIdData(searchUserId);

  useEffect(() => {
    // Determine if we just successfully fetched a user by ID
    if (
      searchUserId &&
      searchUserData &&
      searchUserData.status &&
      !isLoadSearch &&
      !isErrSearch
    ) {
      // Use setTimeout to avoid synchronous setState warning
      const timer = setTimeout(() => setIsModalOpen(true), 0);
      return () => clearTimeout(timer);
    }

    // Handle search error
    if (searchUserId && isErrSearch && errSearch) {
      toast.error(
        errSearch instanceof Error ? errSearch.message : "User not found",
      );
      const timer = setTimeout(() => setSearchUserId(undefined), 0); // Reset search on error
      return () => clearTimeout(timer);
    }
  }, [searchUserId, searchUserData, isLoadSearch, isErrSearch, errSearch]);

  const isLoading = searchUserId ? isLoadSearch : isLoadCurrent;
  const isError = searchUserId ? isErrSearch : isErrCurrent;
  const error = searchUserId ? errSearch : errCurrent;
  const userData = searchUserId ? searchUserData : currentUserData;

  // Resolve the ID for the UserInfoModal (searched user or logged-in user)
  const rootIdCode = searchUserId
    ? searchUserData && "user" in searchUserData
      ? searchUserData.user.id_code
      : undefined
    : currentUserData && "user data" in currentUserData
      ? currentUserData["user data"].id_code
      : undefined;

  const handleReset = () => {
    setSearchUserId(undefined);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a365d]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4">
        <p className="text-red-500 font-medium">Error loading genealogy data</p>
        <p className="text-slate-500 text-sm">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <button
          onClick={handleReset}
          className="text-brand-navy underline text-sm cursor-pointer"
        >
          Reset to my profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)] overflow-hidden relative">
      <TransformWrapper
        initialScale={0.7}
        minScale={0.2}
        maxScale={2}
        initialPositionX={0}
        initialPositionY={0}
        centerOnInit={true}
        limitToBounds={false}
      >
        <div className="flex flex-col h-full gap-6">
          <GenealogyFilters
            onSearch={(id) => setSearchUserId(id)}
            onReset={handleReset}
            onOpenInfo={() => setIsModalOpen(true)}
            hasSearch={!!searchUserId}
          />
          <GenealogyTree userData={userData} />
        </div>
      </TransformWrapper>

      <UserInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={rootIdCode || null}
      />
    </div>
  );
}
