import type { Metadata } from "next";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <p>
            chat layout layout
        </p>
        {children}
    </>
  );
}
