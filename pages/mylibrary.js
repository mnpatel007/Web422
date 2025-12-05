import { useAtom } from "jotai";
import { myLibraryAtom, favouritesAtom } from "@/store";
import { useState } from "react";
import { Table, Button } from "react-bootstrap";
import PageHeader from "@/components/PageHeader";
import MyLibraryForm from "@/components/MyLibraryForm";

export default function MyLibrary() {
    const [library, setLibrary] = useAtom(myLibraryAtom);
    const [favourites, setFavourites] = useAtom(favouritesAtom);
    const [editing, setEditing] = useState(null);

    const handleDelete = (id) =>
        setLibrary((curr) => curr.filter((b) => b.id !== id));

    const handleEdit = (book) => setEditing(book);

    const handleSave = (book) => {
        if (editing) {
            setLibrary((curr) =>
                curr.map((b) => (b.id === editing.id ? { ...book, id: b.id } : b))
            );
            setEditing(null);
        } else {
            setLibrary((curr) => [...curr, { ...book, id: Date.now() }]);
        }
    };

    const toggleFavourite = (book) => {
        const key = `local-${book.id}`;
        setFavourites((curr) =>
            curr.includes(key)
                ? curr.filter((f) => f !== key)
                : [...curr, key]
        );
    };

    return (
        <>
            <PageHeader text="My Library" subtext="Manage your own book list" />
            <MyLibraryForm onSave={handleSave} editing={editing} />

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {library.map((book) => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.year}</td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => toggleFavourite(book)}
                                >
                                    ★
                                </Button>{" "}
                                <Button
                                    size="sm"
                                    variant="outline-warning"
                                    onClick={() => handleEdit(book)}
                                >
                                    Edit
                                </Button>{" "}
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDelete(book.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
