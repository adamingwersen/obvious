import SettingsForm from "@/components/forms/settings-form";
import { UserActionProvider } from "@/hooks/server-actions/user";
import { handleUpdateUser } from "@/server/actions/user/actions";
import { api } from "@/trpc/server";

const SettingsPage = async () => {
  const userWithOrg = await api.user.getUserWithOrg();
  if (!userWithOrg) throw new Error("Cant find user?!");
  if (!userWithOrg.organisation) throw new Error("Cant find org for user?!?");
  return (
    <div className="mx-auto flex w-2/3 flex-col items-center">
      <p>Settings</p>
      <UserActionProvider
        updateUser={handleUpdateUser}
        pathToRevalidate="/(protected)/settings"
      >
        <SettingsForm
          user={userWithOrg}
          org={userWithOrg.organisation}
        ></SettingsForm>
      </UserActionProvider>
    </div>
  );
};
export default SettingsPage;
