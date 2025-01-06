import { applicationName, companyName } from "@/app-config";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { getCurrentYear } from "@/util/date";

export function Footer() {
  return (
    <>
      <footer className="border-t bg-gray-100 dark:bg-background">
        <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-3">
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Empresa
              </h3>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Central de Ajuda
              </h3>
              <ul className="text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h3>
              <ul className="text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <Link href="/privacy" className="hover:underline">
                    Política de Privacidade
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/terms-of-service" className="hover:underline">
                    Termos de Serviço
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <ModeToggle />
          </div>
        </div>
      </footer>
      <footer className="py-8 px-5 border-t">
        <div className="text-center">
          <span className="block text-sm text-center text-gray-500 dark:text-gray-400">
            © {getCurrentYear()} <Link href="/">{applicationName}</Link>. Todos
            os direitos reservados. Feito com ❤️ por {companyName}
          </span>
        </div>
      </footer>
    </>
  );
}
