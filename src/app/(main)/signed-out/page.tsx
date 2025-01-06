"use client";

import { Button } from "@/components/ui/button";
import { pageTitleStyles } from "@/styles/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignedOutPage() {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6">
      <h1 className={pageTitleStyles}>Desconectado com Sucesso</h1>
      <p className="text-xl">
        Você foi desconectado com sucesso. Agora você pode fazer login em sua
        conta.
      </p>

      <Button asChild>
        <Link href="/sign-in">Entrar</Link>
      </Button>
    </div>
  );
}
