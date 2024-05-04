import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function ProfilePage() {
  const { query: { uuid } } = useRouter()
  const { data } = api.profile.getProfile.useQuery({ id: (uuid as string) });
  return <div>{JSON.stringify(data)}</div>
}
