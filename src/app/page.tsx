import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChefHat,
  Clock,
  QrCode,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: QrCode,
    title: "Escanea el QR",
    description:
      "El cliente llega a la mesa, abre la cámara y entra a tu menú al instante. Sin descargar nada.",
    accent: "tangerine",
  },
  {
    step: "02",
    icon: Smartphone,
    title: "Arma su pedido",
    description:
      "Navega tu carta, selecciona productos y confirma desde su propio celular cuando quiera.",
    accent: "mint",
  },
  {
    step: "03",
    icon: ChefHat,
    title: "Cocina lo prepara",
    description:
      "El pedido cae directo al monitor de cocina. Tu equipo lo marca como listo y lo despacha.",
    accent: "grape",
  },
] as const;

const FEATURES = [
  {
    icon: QrCode,
    title: "Sin descargas, sin apps",
    description:
      "Tus clientes no instalan nada. Escanean, piden y listo. Cero fricción.",
    accent: "tangerine",
  },
  {
    icon: ChefHat,
    title: "Monitor de cocina (KDS)",
    description:
      "Pantalla en cocina con pedidos en tiempo real. Marca en preparación y listo con un toque.",
    accent: "mint",
  },
  {
    icon: Clock,
    title: "Cero filas, cero esperas",
    description:
      "El cliente pide cuando esté listo. Tu mesero entrega y cobra. Mesa rota más rápido.",
    accent: "grape",
  },
  {
    icon: Zap,
    title: "Listo en 10 minutos",
    description:
      "Subes tu menú, generas tus QRs, los pegas en las mesas. Empezás a vender el mismo día.",
    accent: "tangerine",
  },
] as const;

type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: readonly string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

const PRICING: readonly PricingPlan[] = [
  {
    name: "Starter",
    price: "$9",
    cadence: "/mes",
    description: "Para emprendedores y locales pequeños arrancando.",
    features: [
      "1 local",
      "Hasta 5 mesas",
      "Menú con categorías y productos",
      "QRs ilimitados, listos para imprimir",
      "Pedidos en tiempo real",
    ],
    cta: "Empezar gratis",
    href: "/signup?plan=starter",
  },
  {
    name: "Growth",
    price: "$25",
    cadence: "/mes",
    description: "Para cafés y restaurantes en crecimiento.",
    features: [
      "1 local",
      "Mesas ilimitadas",
      "Modificadores y combos",
      "Monitor de cocina (KDS)",
      "Reporte diario de ventas",
      "Soporte prioritario",
    ],
    cta: "Probar 7 días gratis",
    href: "/signup?plan=growth",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$49",
    cadence: "/mes",
    description: "Para multi-local, franquicias y operaciones grandes.",
    features: [
      "Locales ilimitados",
      "Inventario básico",
      "Roles y permisos por usuario",
      "Integraciones (POS, contabilidad)",
      "Soporte 24/7",
    ],
    cta: "Hablar con ventas",
    href: "/contact?plan=pro",
  },
] as const;

const FAQ = [
  {
    q: "¿Necesito imprimir los QRs yo mismo?",
    a: "Sí, pero te los generamos listos para imprimir desde el panel — solo descargás un PDF, los pegás en cada mesa y listo. Si querés, también te ofrecemos un servicio de impresión con tu marca (consultá precios).",
  },
  {
    q: "¿Mi cliente necesita conexión a internet?",
    a: "Sí, una conexión básica del local (WiFi o datos) basta. El menú y el pedido pesan poco — funciona incluso en redes lentas.",
  },
  {
    q: "¿Mesa cobra a mis clientes? ¿Acepta tarjetas?",
    a: "No. Mesa solo gestiona el pedido. El cobro lo seguís haciendo vos como siempre — efectivo, transferencia, POS — al momento de entregar la cuenta.",
  },
  {
    q: "¿Puedo cambiar de plan cuando quiera?",
    a: "Cuando quieras. Subís o bajás de plan desde el panel y se prorratea automáticamente. Sin contratos a largo plazo.",
  },
  {
    q: "¿Qué pasa si me arrepiento?",
    a: "Tenés 7 días de prueba gratis sin tarjeta. Si después del primer mes pago decidís parar, cancelás con un click. Sin preguntas, sin enredos.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30"
          >
            <QrCode className="size-4" />
          </span>
          Mesa
        </Link>
        <nav aria-label="Principal" className="hidden md:flex md:items-center md:gap-8">
          <a
            href="#como-funciona"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cómo funciona
          </a>
          <a
            href="#precios"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Precios
          </a>
          <a
            href="#faq"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Preguntas
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants(), "h-10 px-4 text-sm")}
          >
            Probar gratis
            <ArrowRight aria-hidden="true" className="ml-1 size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative"
    >
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium accent-mint animate-float-y">
            <Sparkles aria-hidden="true" className="size-3" />
            Nuevo · Comandas QR para tu restaurante
          </span>
          <h1
            id="hero-heading"
            className="animate-fade-up text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
          >
            Tu carta en cada mesa,{" "}
            <span className="text-brand-gradient animate-shimmer-text">
              sin esperar al mesero.
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl animate-fade-up text-balance text-base text-muted-foreground md:text-lg"
            style={{ "--stagger": 1 } as React.CSSProperties}
          >
            Comandas digitales para cafés, comida rápida y emprendedores.
            Cliente escanea, pide y la cocina lo prepara. Setup en 10 minutos.
          </p>
          <div
            className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ "--stagger": 2 } as React.CSSProperties}
          >
            <Link
              href="/demo"
              className={cn(
                buttonVariants(),
                "group h-12 w-full px-6 text-base sm:w-auto"
              )}
            >
              Probar el demo
              <ArrowRight
                aria-hidden="true"
                className="ml-1.5 size-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </Link>
            <Link
              href="#como-funciona"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 w-full px-6 text-base sm:w-auto"
              )}
            >
              Ver cómo funciona
            </Link>
          </div>
          <p
            className="mt-6 animate-fade-up text-sm text-muted-foreground"
            style={{ "--stagger": 3 } as React.CSSProperties}
          >
            7 días gratis · Sin tarjeta · Cancelás cuando quieras
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="how-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Cómo funciona
          </p>
          <h2
            id="how-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Así de fácil. Tres pasos y estás vendiendo.
          </h2>
        </div>
        <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.step}
                className="animate-fade-up"
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <Card className="group hover-tilt h-full p-6 hover:shadow-xl">
                  <CardHeader className="px-0">
                    <div className="flex items-center justify-between">
                      <span
                        aria-hidden="true"
                        className={`grid size-11 place-items-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 accent-${step.accent}`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs text-muted-foreground"
                      >
                        {step.step}
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-lg">{step.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Por qué Mesa
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Todo lo que tu negocio necesita. Nada de lo que no.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group hover-tilt h-full animate-fade-up p-6 hover:shadow-xl"
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <CardHeader className="px-0">
                  <span
                    aria-hidden="true"
                    className={`grid size-11 place-items-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 accent-${feature.accent}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="mt-4 text-base">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section
      id="precios"
      aria-labelledby="pricing-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Precios
          </p>
          <h2
            id="pricing-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Honesto. Sin contratos. Cancelás cuando quieras.
          </h2>
          <p className="mt-4 text-balance text-base text-muted-foreground">
            Empezá gratis con todos los planes. Pagás solo cuando estés listo.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING.map((plan, i) => (
            <Card
              key={plan.name}
              className={cn(
                "hover-tilt h-full animate-fade-up p-6 hover:shadow-xl",
                plan.highlighted &&
                  "relative overflow-visible ring-2 ring-brand-tangerine shadow-lg shadow-brand-tangerine/20"
              )}
              style={{ "--stagger": i } as React.CSSProperties}
            >
              {plan.highlighted ? (
                <span
                  aria-label="Plan más popular"
                  className="absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-tangerine px-3.5 py-1 text-xs font-semibold text-brand-tangerine-foreground shadow-lg shadow-brand-tangerine/40 ring-2 ring-background animate-shine-pulse"
                >
                  <Sparkles aria-hidden="true" className="size-3" />
                  Más popular
                </span>
              ) : null}
              <CardHeader className="px-0">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription className="mt-1 text-sm">
                  {plan.description}
                </CardDescription>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.cadence}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="px-0">
                <Link
                  href={plan.href}
                  className={cn(
                    buttonVariants({
                      variant: plan.highlighted ? "default" : "outline",
                    }),
                    "h-11 w-full text-sm"
                  )}
                >
                  {plan.cta}
                </Link>
                <Separator className="my-6" />
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand-mint/40 text-brand-mint-foreground"
                      >
                        <Check className="size-3" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Preguntas comunes
          </h2>
        </div>
        <dl className="mt-12 space-y-8">
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-base font-medium text-foreground">{q}</dt>
              <dd className="mt-2 text-base text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
        <h2
          id="final-cta-heading"
          className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Empezá hoy. Cobrá mañana.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          Crea tu cuenta, subí tu menú, generá tus QRs. En 10 minutos tu primera
          mesa puede estar pidiendo desde el celular.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/demo"
            className={cn(
              buttonVariants(),
              "group h-12 w-full px-6 text-base sm:w-auto"
            )}
          >
            Probar el demo
            <ArrowRight
              aria-hidden="true"
              className="ml-1.5 size-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            />
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 w-full px-6 text-base sm:w-auto"
            )}
          >
            Hablar con nosotros
          </Link>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-sm text-muted-foreground md:flex-row md:px-8">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground"
          >
            <QrCode className="size-3" />
          </span>
          <span className="font-medium text-foreground">Mesa</span>
          <span>· © {new Date().getFullYear()}</span>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="#" className="transition-colors hover:text-foreground">
            Términos
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Privacidad
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Contacto
          </a>
        </nav>
      </div>
    </footer>
  );
}
