import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { Button, Col, Row } from "react-bootstrap";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function BookDetails({ book, workId, showFavouriteBtn = true }) {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);

    useEffect(() => {
        setShowAdded(favouritesList?.includes(workId));
    }, [favouritesList]);

    const favouritesClicked = async () => {
        if (showAdded) {
            setFavouritesList(await removeFromFavourites(workId));
            setShowAdded(false);
        } else {
            setFavouritesList(await addToFavourites(workId));
            setShowAdded(true);
        }
    };

    return (
        <Row>
            <Col lg={4} className="text-center">
                <img
                    className="img-fluid rounded shadow-sm"
                    src={
                        book.covers
                            ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
                            : "/favicon.ico"
                    }
                    alt={book.title}
                    onError={(e) => (e.target.src = "/favicon.ico")}
                />
            </Col>
            <Col lg={8}>
                <h2>{book.title}</h2>
                <p>{book.description?.value || book.description || "No description."}</p>
                <p><strong>First published:</strong> {book.first_publish_date || "N/A"}</p>
                {showFavouriteBtn && (
                    <Button
                        variant={showAdded ? "primary" : "outline-primary"}
                        onClick={favouritesClicked}
                    >
                        {showAdded ? "+ Favourite (added)" : "+ Favourite"}
                    </Button>
                )}
            </Col>
        </Row>
    );
}
