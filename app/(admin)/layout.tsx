import AdminHeader from "@/components/adminHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <AdminHeader />
        {children}
    </>
  );
}
