import { useRouter } from "next/router";
import useSWR from "swr";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { favouritesAtom, myLibraryAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";
import PageHeader from "@/components/PageHeader";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Books() {
    const router = useRouter();
    const queryString = new URLSearchParams(router.query).toString();
    const [page, setPage] = useState(1);
    const [favouritesList, setFavourites] = useAtom(favouritesAtom);
    const favourites = favouritesList || [];
    const [library, setLibrary] = useAtom(myLibraryAtom);

    const url = queryString
        ? `https://openlibrary.org/search.json?${queryString}&page=${page}&limit=20`
        : `https://openlibrary.org/search.json?subject=fiction&page=${page}&limit=20`;

    const { data, error } = useSWR(url, fetcher);

    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({ title: "", author: "", year: "" });

    const handleClose = () => {
        setShowModal(false);
        setEditingBook(null);
        setFormData({ title: "", author: "", year: "" });
    };

    const handleShow = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author_name?.[0] || "",
            year: book.first_publish_year || ""
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.title || !formData.author) return;
        const updated = {
            id: Date.now(),
            title: formData.title,
            author: formData.author,
            year: formData.year
        };
        setLibrary((prev) => [...prev, updated]);
        handleClose();
    };

    const handleDelete = (title) => {
        setLibrary((prev) => prev.filter((b) => b.title !== title));
    };

    const toggleFavourite = async (book) => {
        const id = book.key.replace("/works/", "");

        if (favourites.includes(id)) {
            setFavourites(await removeFromFavourites(id));
        } else {
            setFavourites(await addToFavourites(id));
        }
    };

    if (error) return <p>Error loading data.</p>;
    if (!data) return <p>Loading...</p>;

    const subtext = queryString
        ? Object.entries(router.query)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        : "Showing sample fiction books. You can favourite, edit, or delete below.";

    const nextPage = () => setPage((p) => p + 1);
    const prevPage = () => setPage((p) => Math.max(1, p - 1));

    return (
        <>
            <PageHeader text="Books" subtext="Search the world's largest library (OpenLibrary.org)" />

            <div className="row g-4">
                {data.docs.map((book, index) => {
                    const id = book.key.replace("/works/", "");
                    const isFavourite = favourites?.includes(id);

                    return (
                        <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3">
                            <div className="card h-100 border-0 shadow-sm glass-panel">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title text-truncate w-75" title={book.title}>{book.title || "Untitled"}</h5>
                                        <span className="badge bg-secondary">{book.first_publish_year || "N/A"}</span>
                                    </div>
                                    <p className="card-text text-muted small mb-3">
                                        by {book.author_name?.join(", ") || "Unknown"}
                                    </p>
                                    <div className="mt-auto d-flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-grow-1"
                                            variant={isFavourite ? "success" : "outline-success"}
                                            onClick={() => toggleFavourite(book)}
                                        >
                                            {isFavourite ? "★ Favourited" : "☆ Favourite"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-success"
                                            onClick={() => handleShow(book)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleDelete(book.title)}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="d-flex justify-content-between my-4">
                <Button
                    variant="outline-primary"
                    onClick={prevPage}
                    disabled={page === 1}
                >
                    ← Previous
                </Button>
                <span>Page {page}</span>
                <Button
                    variant="outline-primary"
                    onClick={nextPage}
                    disabled={!data.docs || data.docs.length === 0}
                >
                    Next →
                </Button>
            </div>

            {/* Edit / Add Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit / Add Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={(e) =>
                                    setFormData({ ...formData, author: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({ ...formData, year: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
