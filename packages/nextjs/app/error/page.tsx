import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full font-medium">
        <p>Sorry, something went wrong. Please try again later.</p>
        <Link href="/" className="btn btn-secondary w-full mt-2">
          Go Home
        </Link>
      </div>
    </>
  );
}
