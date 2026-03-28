import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useDownline } from "../../features/auth/useUserData";
import { type NodeProps, getLeg } from "./types";
import { NodeCard } from "./NodeCard";
import { UserModal } from "./UserModal";

export function GenealogyNode({
  userId,
  idCode,
  fullName,
  userImage,
  rankName,
  subscriptionName,
  color,
}: NodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: downline, isLoading } = useDownline(userId);

  const leftLeg = downline ? getLeg(downline.members?.left_leg_member) : null;
  const rightLeg = downline ? getLeg(downline.members?.right_leg_member) : null;
  const hasChildren = !!(leftLeg || rightLeg);

  // Use the detailed user data for this node if available from the downline fetch
  const nodeUser = downline?.members?.user;
  const displayFullName = nodeUser
    ? nodeUser.first_name
      ? `${nodeUser.first_name} ${nodeUser.last_name || ""}`.trim()
      : nodeUser.username
    : fullName;
  const displayImage = nodeUser?.image || userImage;
  const displayIdCode = nodeUser?.id_code || idCode;

  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-col items-center relative gap-8">
      <NodeCard
        fullName={displayFullName}
        idCode={displayIdCode}
        userImage={displayImage}
        rankName={rankName}
        color={color}
        onClick={() => setIsModalOpen(true)}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={nodeUser}
        idCode={displayIdCode}
        fullName={displayFullName}
        userImage={displayImage}
        rankName={rankName}
        subscriptionName={subscriptionName}
        color={color}
      />

      {/* Expand Button */}
      {(isLoading || hasChildren) && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="relative z-50 nodrag w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : isExpanded ? (
            <ChevronUp className="w-6 h-6 text-slate-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-600" />
          )}
        </button>
      )}

      {/* Children Section */}
      {isExpanded && downline && hasChildren && (
        <div className="relative pt-12">
          {/* horizontal connector line */}
          {leftLeg && rightLeg && (
            <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-200" />
          )}

          {/* vertical connector line from parent */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />

          <div className="flex gap-12">
            {leftLeg ? (
              <div className="relative flex flex-col items-center">
                {/* vertical line to child */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-200" />
                <GenealogyNode
                  userId={leftLeg.user_id || leftLeg.id}
                  idCode={leftLeg.user_id_code || leftLeg.id_code!}
                  fullName={
                    leftLeg.user_first_name
                      ? `${leftLeg.user_first_name} ${leftLeg.user_last_name}`.trim()
                      : leftLeg.user_name || leftLeg.full_name!
                  }
                  userImage={leftLeg.user_image}
                  rankName={leftLeg.rank_name}
                  subscriptionName={
                    typeof leftLeg.subscription === "string"
                      ? leftLeg.subscription
                      : leftLeg.subscription?.name
                  }
                  color="blue"
                />
              </div>
            ) : (
              <div className="w-56" />
            )}

            {rightLeg ? (
              <div className="relative flex flex-col items-center">
                {/* vertical line to child */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-200" />
                <GenealogyNode
                  userId={rightLeg.user_id || rightLeg.id}
                  idCode={rightLeg.user_id_code || rightLeg.id_code!}
                  fullName={
                    rightLeg.user_first_name
                      ? `${rightLeg.user_first_name} ${rightLeg.user_last_name}`.trim()
                      : rightLeg.user_name || rightLeg.full_name!
                  }
                  userImage={rightLeg.user_image}
                  rankName={rightLeg.rank_name}
                  subscriptionName={
                    typeof rightLeg.subscription === "string"
                      ? rightLeg.subscription
                      : rightLeg.subscription?.name
                  }
                  color="teal"
                />
              </div>
            ) : (
              <div className="w-56" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
