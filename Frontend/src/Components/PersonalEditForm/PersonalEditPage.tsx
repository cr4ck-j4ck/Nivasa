import FloatingBackground from "@/Components/Auth/FloatingBackground"
import PersonalDetailsEditForm from "./PersonalEditForm"

export default function Page() {
  return (
    <main className="relative min-h-[100svh] w-full bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50">
      <FloatingBackground />
      <header className="relative z-10 mx-auto flex w-full items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          {/* Logo placeholder */}
          <img src="/Nivasa-removebg-preview.png" alt="Nivasa Logo" className="h-32 w-32 -mt-10 rounded-lg outline-0 ring-1 ring-black/5" />
        </div>
      </header>

      <section className="relative z-10 px-6 py-4 md:py-8">
        <div className="mx-auto max-w-5xl">
          <PersonalDetailsEditForm />
        </div>
      </section>
    </main>
  )
}
