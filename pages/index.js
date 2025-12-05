/*********************************************************************************
* WEB422 – Assignment 3
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Student Name Student ID: 123456789 Date: 2025-12-05
*
* Vercel App (Deployed) Link: https://vercel.com/your-link
*
********************************************************************************/
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Form, Button } from "react-bootstrap";
import PageHeader from "@/components/PageHeader";

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    router.push({
      pathname: "/books",
      query: Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== "")
      ),
    });
  };

  return (
    <>
      <PageHeader text="Book Search" subtext="Find books from OpenLibrary" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control {...register("author")} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control {...register("title")} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control {...register("subject")} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Language</Form.Label>
          <Form.Control {...register("language")} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>First Publish Year</Form.Label>
          <Form.Control {...register("first_publish_year")} />
        </Form.Group>

        <Button type="submit" variant="primary">Search</Button>
      </Form>
    </>
  );
}
