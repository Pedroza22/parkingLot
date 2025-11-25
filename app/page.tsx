import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Car, Clock, CreditCard, Shield, MapPin, Zap } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  const { data: parkingLots } = await supabase.from("parking_lots").select("*").eq("is_active", true).limit(3)

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Reserva tu espacio de estacionamiento
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              Encuentra y reserva espacios de parqueadero de forma rápida y segura. Sin vueltas, sin estrés.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/parking-lots">
                  <MapPin className="mr-2 h-5 w-5" />
                  Ver Parqueaderos
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/register">Crear Cuenta</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Por qué elegir ParkEasy</h2>
            <p className="mt-4 text-muted-foreground">La forma más inteligente de gestionar tu estacionamiento</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 bg-card shadow-md">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Reserva Instantánea</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reserva tu espacio en segundos desde cualquier dispositivo
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-md">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Disponibilidad 24/7</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Consulta disponibilidad en tiempo real las 24 horas
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-md">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <CreditCard className="h-6 w-6 text-success" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Pagos Seguros</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Múltiples métodos de pago con facturación electrónica
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-md">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <Shield className="h-6 w-6 text-warning" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Garantía de Espacio</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tu espacio reservado te espera sin importar la hora
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-md">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Múltiples Ubicaciones</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Red de parqueaderos en toda la ciudad a tu disposición
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-md">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Car className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Todo Tipo de Vehículos</h3>
                <p className="mt-2 text-sm text-muted-foreground">Espacios para autos, motos y vehículos eléctricos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Parking Lots Preview */}
      {parkingLots && parkingLots.length > 0 && (
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Parqueaderos Disponibles</h2>
                <p className="mt-2 text-muted-foreground">Encuentra el lugar perfecto para tu vehículo</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/parking-lots">Ver todos</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {parkingLots.map((lot) => (
                <Card key={lot.id} className="overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20" />
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-foreground">{lot.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {lot.address}, {lot.city}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">${lot.hourly_rate.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">por hora</p>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/parking-lots/${lot.id}`}>Reservar</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Car className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">ParkEasy</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 ParkEasy. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
