import { redirect } from "next/navigation";

interface SingularProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function SingularProjectPage({ params }: SingularProjectPageProps) {
  const { id } = await params;
  redirect(`/projects/${id}`);
}
