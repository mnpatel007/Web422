import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { authenticateUser } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { getFavourites } from '@/lib/userData';

export default function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [, setFavourites] = useAtom(favouritesAtom);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await authenticateUser(user, password);
            await updateAtoms();
            router.push('/');
        } catch (err) {
            setError(err.message);
        }
    }

    async function updateAtoms() {
        setFavourites(await getFavourites());
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel p-5 rounded-4 w-100" style={{ maxWidth: '450px' }}>
                <h2 className="text-center mb-4 fw-bold text-primary">Welcome Back</h2>
                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-muted small text-uppercase fw-bold">Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={user}
                            onChange={e => setUser(e.target.value)}
                            placeholder="Enter your username"
                            className="py-2"
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-muted small text-uppercase fw-bold">Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="py-2"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 py-2 mb-3">
                        Sign In
                    </Button>
                    <div className="text-center text-muted">
                        Don't have an account? <a href="/register" className="text-primary text-decoration-none">Register</a>
                    </div>
                </Form>
            </div>
        </Container>
    );
}
