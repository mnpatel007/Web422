import Link from "next/link";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { readToken, removeToken } from "@/lib/authenticate";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSetAtom } from "jotai";
import { favouritesAtom } from "@/store";

export default function MainNav() {
    const router = useRouter();
    const [token, setToken] = useState(null);

    useEffect(() => {
        setToken(readToken());
    }, []);

    const setFavourites = useSetAtom(favouritesAtom);

    function logout() {
        removeToken();
        setToken(null);
        setFavourites([]); // Clear favourites on logout
        router.push('/');
    }

    return (
        <Navbar expand="lg" className="mb-4 sticky-top" style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #334155' }}>
            <Container>
                <Navbar.Brand as={Link} href="/" className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.5rem' }}>📚</span>
                    <span className="fw-bold text-white">BookSearch</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto ms-lg-4 gap-2">
                        <Nav.Link as={Link} href="/books" className={router.pathname === "/books" ? "text-primary fw-bold" : "text-muted"}>Books</Nav.Link>
                        {token && <Nav.Link as={Link} href="/favourites" className={router.pathname === "/favourites" ? "text-primary fw-bold" : "text-muted"}>Favourites</Nav.Link>}
                        {token && <Nav.Link as={Link} href="/mylibrary" className={router.pathname === "/mylibrary" ? "text-primary fw-bold" : "text-muted"}>My Library</Nav.Link>}
                        <Nav.Link as={Link} href="/about" className={router.pathname === "/about" ? "text-primary fw-bold" : "text-muted"}>About</Nav.Link>
                    </Nav>
                    <Nav className="gap-2 align-items-center">
                        {token ? (
                            <NavDropdown
                                title={<span className="text-white fw-medium">👤 {token.userName || "User"}</span>}
                                id="basic-nav-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item onClick={logout} className="text-danger">Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Link href="/login" passHref legacyBehavior>
                                    <Button variant="outline-primary" className="me-2 px-4">Login</Button>
                                </Link>
                                <Link href="/register" passHref legacyBehavior>
                                    <Button variant="primary" className="px-4">Register</Button>
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
