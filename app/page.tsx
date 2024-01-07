import Link from "next/link";
import { Button } from "@nextui-org/button";
import Header from "@/components/header";

export default function LandingPage() {
  return (
    <>
    <Header />
      <p>Main Page</p>
      <li>
        <ol>
          <Link href="/login">
            <Button>Login Page</Button>
          </Link>
        </ol>
        <ol>
          <Link href="/signup">
            <Button>Signup Page</Button>
          </Link>
        </ol>

        <ol>
          <Link href="/chat">
            <Button>Chat Window</Button>
          </Link>
        </ol>
        <ol>
          <Link href="/admin/login">
            <Button>Message Window</Button>
          </Link>
        </ol>
      </li>
    </>
  );
}
