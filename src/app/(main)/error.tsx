"use client";

import { AUTHENTICATION_ERROR_MESSAGE } from "@/app/(main)/util";
import { Button } from "@/components/ui/button";
import { pageTitleStyles } from "@/styles/common";
import Link from "next/link";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const isAuthenticationError = error.message.includes(
    AUTHENTICATION_ERROR_MESSAGE
  );

  return (
    <div className="container mx-auto py-12 min-h-screen space-y-8">
      {isAuthenticationError ? (
        <>
          <h1 className={pageTitleStyles}>Ops! Você Precisa Estar Logado</h1>
          <p className="text-lg">
            Para acessar esta página, faça login primeiro.
          </p>

          <Button asChild>
            <Link href="/sign-in">Entrar</Link>
          </Button>
        </>
      ) : (
        <>
          <h1 className={pageTitleStyles}>Ops! Algo deu errado</h1>
          <p className="text-lg">{error.message}</p>
        </>
      )}
    </div>
  );
}
