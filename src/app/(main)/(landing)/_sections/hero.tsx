import { SignedIn } from "@/components/auth";
import { SignedOut } from "@/components/auth";
import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <>
      <Container>
        <div className="flex flex-col md:flex-row gap-y-14 w-full justify-between">
          <div className="">
            <Badge className="text-sm md:text-base">
              Acompanhe e Expanda Sua Coleção de Cartas Pokémon
            </Badge>
            <h1 className="text-5xl md:text-7xl max-w-3xl mt-10 leading-[1.2] font-semibold">
              Comece a construir sua coleção hoje mesmo!
            </h1>
            <p className="mt-5 text-gray-500 text-lg max-w-[600px]">
              Pokesaga é a plataforma definitiva para acompanhar, descobrir e
              gerenciar sua coleção de cartas Pokémon. Busque facilmente suas
              cartas pelo nome ou pelo conjunto, visualize informações
              detalhadas sobre cada carta e consulte seus preços em BRL.
              Acompanhe o crescimento de sua coleção e obtenha insights sobre
              tendências do mercado e valores das cartas.
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 mt-10">
              <SignedIn>
                <Button asChild>
                  <Link href={"/dashboard"}>Acompanhar coleções</Link>
                </Button>
              </SignedIn>

              <SignedOut>
                <Button asChild>
                  <Link href={"/sign-in"}>Criar conta</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
          <Image
            className="rounded-xl w-[500px] h-[200px] mt-20"
            width="500"
            height="500"
            src="/hero.png"
            alt="hero image"
          />
        </div>
      </Container>
    </>
  );
}
