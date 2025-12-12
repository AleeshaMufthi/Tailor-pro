import Header from "@/components/Header";

export default function LandingLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
