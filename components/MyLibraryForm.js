import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

export default function MyLibraryForm({ onSave, editing }) {
    const [form, setForm] = useState({ title: "", author: "", year: "" });

    useEffect(() => {
        if (editing) setForm(editing);
    }, [editing]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.author) return;
        onSave(form);
        setForm({ title: "", author: "", year: "" });
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label>Author</Form.Label>
                <Form.Control
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label>Year</Form.Label>
                <Form.Control
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button type="submit" variant="primary">
                {editing ? "Update Book" : "Add Book"}
            </Button>
        </Form>
    );
}
