import { useAtom } from "jotai";
import { favouritesAtom, myLibraryAtom } from "@/store";
import { Row, Col, Card } from "react-bootstrap";
import PageHeader from "@/components/PageHeader";
import BookCard from "@/components/BookCard";

export default function Favourites() {
    const [favouritesList] = useAtom(favouritesAtom);
    const [library] = useAtom(myLibraryAtom);

    if (!favouritesList) return null;

    if (favouritesList.length === 0)
        return <PageHeader text="Favourites" subtext="No favourite books yet." />;

    // Separate API favourites from local ones
    const localFavs = favouritesList
        .filter((id) => id.startsWith("local-"))
        .map((id) => library.find((b) => `local-${b.id}` === id))
        .filter(Boolean);

    const apiFavs = favouritesList
        .filter((id) => !id.startsWith("local-"))
        .map((id) => id.replace("/works/", "").replace("works/", ""));

    return (
        <>
            <PageHeader text="Favourites" subtext="Books you love" />
            <Row className="gy-4">
                {/* Local favourites */}
                {localFavs.map((book) => (
                    <Col key={`local-${book.id}`} lg={3} md={6}>
                        <Card className="h-100 shadow-sm border-success">
                            <Card.Body>
                                <Card.Title>{book.title}</Card.Title>
                                <Card.Text>
                                    {book.author} ({book.year || "N/A"})
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

                {/* API favourites */}
                {apiFavs.map((workId) => (
                    <Col key={workId} lg={3} md={6}>
                        <BookCard workId={workId} />
                    </Col>
                ))}
            </Row>
        </>
    );
}
