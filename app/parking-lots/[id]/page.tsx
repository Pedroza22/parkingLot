import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { ReservationForm } from "@/components/reservation-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Clock, ArrowLeft, Car, Bike, Zap, Accessibility } from "lucide-react"

export default async function ParkingLotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081/api"
  const lotRes = await fetch(`${apiBase}/parking-lots/${id}`, { cache: "no-store" })
  const parkingLot = await lotRes.json()
  const spotsRes = await fetch(`${apiBase}/parking-spots?parkingLotId=${id}&availableOnly=false`, { cache: "no-store" })
  const spots = await spotsRes.json()

  if (!parkingLot) {
    notFound()
  }

  const availableSpots = spots.filter((s: { isAvailable: boolean }) => s.isAvailable)

  const getSpotTypeLabel = (type: string) => {
    switch (type) {
      case "handicapped":
        return "Discapacitados"
      case "motorcycle":
        return "Motocicleta"
      case "electric":
        return "Eléctrico"
      default:
        return "Estándar"
    }
  }

  const getSpotTypeIcon = (type: string) => {
    switch (type) {
      case "handicapped":
        return <Accessibility className="h-4 w-4" />
      case "motorcycle":
        return <Bike className="h-4 w-4" />
      case "electric":
        return <Zap className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/parking-lots">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a parqueaderos
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 h-64 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20" />

            <h1 className="text-3xl font-bold text-foreground">{parkingLot.name}</h1>

            <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {parkingLot.address}, {parkingLot.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {parkingLot.opening_time.slice(0, 5)} - {parkingLot.closing_time.slice(0, 5)}
              </span>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Espacios Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                {availableSpots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
                    {spots?.map(
                      (spot: { id: string; spotNumber: string; spot_type?: string; spotType?: string; is_available?: boolean; isAvailable?: boolean }) => (
                        <div
                          key={spot.id}
                          className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-colors ${
                            (spot.isAvailable ?? spot.is_available)
                              ? "border-success/50 bg-success/10 text-success"
                              : "border-muted bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {getSpotTypeIcon((spot.spotType ?? spot.spot_type) as string)}
                          <span className="mt-1 text-xs font-medium">{spot.spotNumber}</span>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No hay espacios disponibles en este momento</p>
                )}

                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-success/20 border border-success/50" />
                    <span className="text-sm text-muted-foreground">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-muted/50 border border-muted" />
                    <span className="text-sm text-muted-foreground">Ocupado</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[...new Set(spots?.map((s: { spotType?: string; spot_type?: string }) => (s.spotType ?? s.spot_type) as string))].map(
                    (type) => (
                      <Badge key={type as string} variant="outline" className="gap-1">
                        {getSpotTypeIcon(type as string)}
                        {getSpotTypeLabel(type as string)}
                      </Badge>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Hacer Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary">${parkingLot.hourly_rate.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">por hora</p>
                </div>

                {user ? (
                  availableSpots.length > 0 ? (
                    <ReservationForm
                      parkingLotId={parkingLot.id}
                      availableSpots={availableSpots}
                      hourlyRate={parkingLot.hourly_rate}
                    />
                  ) : (
                    <p className="text-center text-muted-foreground">No hay espacios disponibles para reservar</p>
                  )
                ) : (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-muted-foreground">Inicia sesión para hacer una reserva</p>
                    <Button asChild className="w-full">
                      <Link href="/auth/login">Iniciar Sesión</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
