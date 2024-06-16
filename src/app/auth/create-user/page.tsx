import CreateUser from "@/components/organisation/organisation-select";
import { api } from "@/trpc/server";
import { handleCreateUser } from "./actions";

export default async function CreateUserPage() {
  const orgs = await api.organisation.findAll({});

  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center gap-4">
      <h1>Account created</h1>
      <p>We just need to link you to an organisation to finish up</p>
      <CreateUser
        organisations={orgs}
        handleCreateUser={handleCreateUser}
      ></CreateUser>
    </div>
  );
}
