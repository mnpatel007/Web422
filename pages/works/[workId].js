import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import BookDetails from "@/components/BookDetails";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Work() {
    const router = useRouter();
    const { workId } = router.query;

    const { data, error } = useSWR(
        workId ? `https://openlibrary.org/works/${workId}.json` : null,
        fetcher
    );

    if (error) return <Error statusCode={404} />;
    if (!data) return <p>Loading...</p>;

    return <BookDetails book={data} workId={workId} />;
}
