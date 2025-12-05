import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { registerUser } from '@/lib/authenticate';

export default function Register() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (password !== passwordConfirm) {
                throw new Error("Passwords do not match");
            }
            await registerUser(user, password, passwordConfirm);
            router.push('/login');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel p-5 rounded-4 w-100" style={{ maxWidth: '450px' }}>
                <h2 className="text-center mb-4 fw-bold text-primary">Create Account</h2>
                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-muted small text-uppercase fw-bold">Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={user}
                            onChange={e => setUser(e.target.value)}
                            placeholder="Choose a username"
                            className="py-2"
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-muted small text-uppercase fw-bold">Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Create a password"
                            className="py-2"
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-muted small text-uppercase fw-bold">Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={passwordConfirm}
                            onChange={e => setPasswordConfirm(e.target.value)}
                            placeholder="Confirm your password"
                            className="py-2"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 py-2 mb-3">
                        Register
                    </Button>
                    <div className="text-center text-muted">
                        Already have an account? <a href="/login" className="text-primary text-decoration-none">Login</a>
                    </div>
                </Form>
            </div>
        </Container>
    );
}
