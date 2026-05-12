import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Info,
  QrCode,
  Smartphone,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RESTAURANT } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SAMPLE_TABLE = 3;

export default function DemoPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12 md:px-8 md:py-16">
      <header className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Volver a la landing
        </Link>
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium accent-mint">
            Demo en vivo · Sin registro
          </span>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Probá Mesa como{" "}
            <span className="text-brand-gradient">cliente y cocina</span> al
            mismo tiempo.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            Abrí las dos vistas en pestañas distintas. Cuando creés un pedido
            como cliente, lo vas a ver caer en cocina al instante — gracias a
            sincronización entre tabs vía BroadcastChannel.
          </p>
        </div>
      </header>

      <section
        aria-labelledby="demo-options"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <h2 id="demo-options" className="sr-only">
          Vistas disponibles
        </h2>

        <Card className="hover-tilt relative h-full p-6 hover:shadow-xl">
          <CardHeader className="px-0">
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-xl accent-tangerine"
            >
              <Smartphone className="size-6" />
            </span>
            <CardTitle className="mt-4 text-xl">Soy cliente</CardTitle>
            <CardDescription className="mt-2 text-base">
              Llegaste a la {RESTAURANT.name}, te sentás en la mesa{" "}
              {SAMPLE_TABLE} y escaneás el QR. Vas a ver el menú, armar tu
              pedido y confirmarlo.
            </CardDescription>
          </CardHeader>
          <div className="mt-6 flex flex-col items-center gap-4 rounded-xl bg-muted/40 p-6">
            <FakeQrCode />
            <p className="text-center text-xs text-muted-foreground">
              Mesa {SAMPLE_TABLE} · {RESTAURANT.name}
            </p>
          </div>
          <Link
            href={`/r/${RESTAURANT.slug}/t/${SAMPLE_TABLE}`}
            className={cn(
              buttonVariants(),
              "group mt-6 h-11 w-full text-sm"
            )}
          >
            Escanear y entrar al menú
            <ArrowRight
              aria-hidden="true"
              className="ml-1.5 size-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            />
          </Link>
        </Card>

        <Card className="hover-tilt relative h-full p-6 hover:shadow-xl">
          <CardHeader className="px-0">
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-xl accent-grape"
            >
              <ChefHat className="size-6" />
            </span>
            <CardTitle className="mt-4 text-xl">Soy cocina</CardTitle>
            <CardDescription className="mt-2 text-base">
              Monitor de pedidos en vivo (KDS). Vas a ver caer los pedidos a
              medida que el cliente los confirma, y los podés mover entre
              estados con un toque.
            </CardDescription>
          </CardHeader>
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-6">
            {(["pending", "preparing", "ready"] as const).map((status) => (
              <div
                key={status}
                className="flex flex-col items-center justify-center gap-1 rounded-lg bg-background py-3 text-center"
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    status === "pending" && "bg-brand-tangerine",
                    status === "preparing" && "bg-brand-mint animate-pulse",
                    status === "ready" && "bg-brand-grape"
                  )}
                />
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {status === "pending" && "Pendiente"}
                  {status === "preparing" && "En curso"}
                  {status === "ready" && "Listo"}
                </span>
              </div>
            ))}
          </div>
          <Link
            href={`/kitchen/${RESTAURANT.slug}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "group mt-6 h-11 w-full text-sm"
            )}
          >
            Abrir monitor de cocina
            <ArrowRight
              aria-hidden="true"
              className="ml-1.5 size-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            />
          </Link>
        </Card>
      </section>

      <aside className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-6">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-lg accent-mint"
          >
            <Info className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Cómo sacarle jugo al demo</h2>
            <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm text-muted-foreground">
              <li>Abrí esta página en dos pestañas distintas del mismo navegador.</li>
              <li>
                En una entrá como{" "}
                <span className="font-medium text-foreground">cliente</span>,
                en la otra como{" "}
                <span className="font-medium text-foreground">cocina</span>.
              </li>
              <li>
                Confirmá un pedido desde el cliente — vas a ver aparecer la
                comanda en cocina al instante.
              </li>
              <li>
                Mové el pedido por los estados desde cocina y mirá cómo el
                cliente ve el progreso en su pantalla de seguimiento.
              </li>
            </ol>
          </div>
        </div>
      </aside>
    </main>
  );
}

function FakeQrCode() {
  const cells = Array.from({ length: 49 });
  return (
    <div
      aria-hidden="true"
      className="relative grid size-32 grid-cols-7 grid-rows-7 gap-0.5 rounded-lg bg-foreground p-2"
    >
      {cells.map((_, i) => {
        const row = Math.floor(i / 7);
        const col = i % 7;
        const corner =
          (row < 2 && col < 2) ||
          (row < 2 && col > 4) ||
          (row > 4 && col < 2);
        const seed = (row * 7 + col * 3 + 5) % 7;
        const filled = corner || seed < 3;
        return (
          <span
            key={i}
            className={cn(
              "rounded-[1px]",
              filled ? "bg-background" : "bg-transparent"
            )}
          />
        );
      })}
      <span className="absolute inset-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-md bg-brand-tangerine ring-2 ring-foreground" />
    </div>
  );
}
