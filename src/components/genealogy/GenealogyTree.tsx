import {
  type UserDataResponse,
  type UserByIdResponse,
} from "../../features/auth/useUserData";
import { TransformComponent } from "react-zoom-pan-pinch";
import { GenealogyNode } from "./GenealogyNode";

interface GenealogyTreeProps {
  userData?: UserDataResponse | UserByIdResponse;
}

export function GenealogyTree({ userData }: GenealogyTreeProps) {
  if (!userData) return null;

  let userId, idCode, fullName, userImage, subscriptionName;

  if ("user data" in userData) {
    const root = userData["user data"];
    const profile = userData.profile;
    userId = root.id;
    idCode = root.id_code;
    fullName = root.first_name
      ? `${root.first_name} ${root.last_name || ""}`.trim()
      : root.username;
    userImage = root.image;
    subscriptionName = profile.subscription;
  } else if ("user" in userData) {
    const root = userData.user;
    userId = root.id;
    idCode = root.id_code;
    fullName = root.first_name
      ? `${root.first_name} ${root.last_name || ""}`.trim()
      : root.username;
    userImage = root.image;
    subscriptionName = null;
  } else {
    return null;
  }

  return (
    <div className="bg-[#f8fafc] rounded-[3rem] p-4 h-full border border-slate-200/60 shadow-inner flex flex-col overflow-auto">
      <TransformComponent
        wrapperStyle={{ width: "100%", height: "100%", flex: 1 }}
        contentStyle={{
          width: "100%",
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "300px 200px",
        }}
      >
        <GenealogyNode
          userId={userId}
          idCode={idCode}
          fullName={fullName}
          userImage={userImage}
          userPackage={subscriptionName || undefined}
          subscriptionName={subscriptionName}
          color="red"
          isRoot={true}
        />
      </TransformComponent>
    </div>
  );
}
