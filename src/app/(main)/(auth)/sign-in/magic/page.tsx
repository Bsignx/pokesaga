import { pageTitleStyles } from "@/styles/common";

export default function MagicLinkPage() {
  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6">
      <h1 className={pageTitleStyles}>Verifique seu e-mail</h1>
      <p className="text-xl">
        Enviamos um link mágico para você fazer login. Clique no link no seu
        e-mail para entrar.
      </p>
    </div>
  );
}
