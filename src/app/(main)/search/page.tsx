import { SearchResults } from "@/components/shared/search-results";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q ?? "";
  return <SearchResults key={query} initialQuery={query} />;
}
