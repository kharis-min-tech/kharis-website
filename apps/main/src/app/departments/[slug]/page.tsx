import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEPARTMENT_PAGES } from "@/data/department-pages";

export function generateStaticParams() {
  return DEPARTMENT_PAGES.map(({ slug }) => ({ slug }));
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const department = DEPARTMENT_PAGES.find((item) => item.slug === slug);
  if (!department) notFound();

  return (
    <main className="department-detail">
      <section className="department-detail__hero">
        <Image src={department.image} alt="" fill priority sizes="100vw" />
        <div className="department-detail__veil" />
        <div className="department-detail__copy">
          <Link href="/life/departments">Kharis Life / Departments</Link>
          <p>Find your place</p>
          <h1>{department.title}</h1>
          <span>{department.body}</span>
        </div>
      </section>
      <section className="department-detail__next">
        <p>Serve with purpose. Grow together.</p>
        <h2>Make a difference in your local church.</h2>
        <Link href="/locations">
          Find your local branch <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
