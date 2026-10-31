import { iniciarSesion } from "./actions";

const MENSAJES: Record<string, string> = {
  credenciales: "Correo o contraseña incorrectos.",
  permiso: "Esta cuenta no tiene acceso al panel.",
  config: "Falta configurar Supabase (revisa .env.local).",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const input =
    "w-full rounded-2xl border-2 border-linea bg-white px-4 py-3.5 text-lg focus:border-azul focus:outline-none";
  return (
    <main className="flex min-h-dvh items-center justify-center bg-niebla px-4">
      <form action={iniciarSesion} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-azul font-display text-xl font-extrabold text-white">
            A
          </span>
          <h1 className="font-display text-2xl font-extrabold">Panel Alex</h1>
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-rojo/10 px-4 py-3 text-[15px] font-semibold text-rojo-hondo">
            {MENSAJES[error] ?? "No se pudo iniciar sesión."}
          </p>
        )}
        <input className={input} type="email" name="email" placeholder="Correo" autoComplete="email" required />
        <input
          className={input}
          type="password"
          name="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          required
        />
        <button className="w-full rounded-2xl bg-rojo px-6 py-4 text-lg font-bold text-white hover:bg-rojo-hondo">
          Entrar
        </button>
      </form>
    </main>
  );
}
