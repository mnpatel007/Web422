import PageHeader from "@/components/PageHeader";

export default function About() {
    return (
        <>
            <PageHeader text="About" subtext="Assignment 2 - WEB422" />
            <p>
                This application lets users search books from the OpenLibrary API and
                mark their favourites. Built with Next.js, React-Bootstrap, SWR, Jotai,
                and React Hook Form.
            </p>
        </>
    );
}
