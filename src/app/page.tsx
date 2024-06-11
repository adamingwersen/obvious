import { redirect } from "next/navigation";

export default function RootPage() {
  // testing purposes only
  const _localvariableThatisStupid = {
    hello: "hello",
  };

  redirect("/home");

  return <></>;
}
