import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Clock, Car, Bike, Zap, Accessibility } from "lucide-react"

export default async function ParkingLotsPage() {
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
  const res = await fetch(`${apiBase}/parking-lots`, { cache: "no-store" })
  const parkingLots: {
    id: string
    name: string
    address: string
    city: string
    hourly_rate: number
    hourlyRate?: number
    opening_time?: string
    closing_time?: string
    openingTime?: string
    closingTime?: string
    is_active?: boolean
    isActive?: boolean
    availableSpots?: number
    spotTypes?: Record<string, number>
  }[] = await res.json()

  const lotsWithAvailability = parkingLots?.map((lot) => ({
    id: lot.id,
    name: lot.name,
    address: lot.address,
    city: lot.city,
    hourly_rate: lot.hourlyRate ?? lot.hourly_rate,
    opening_time: lot.openingTime ?? lot.opening_time,
    closing_time: lot.closingTime ?? lot.closing_time,
    is_active: lot.isActive ?? lot.is_active ?? true,
    available_spots: lot.availableSpots ?? 0,
    spot_types: lot.spotTypes ?? {},
  }))

  const getSpotTypeIcon = (type: string) => {
    switch (type) {
      case "handicapped":
        return <Accessibility className="h-3 w-3" />
      case "motorcycle":
        return <Bike className="h-3 w-3" />
      case "electric":
        return <Zap className="h-3 w-3" />
      default:
        return <Car className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Parqueaderos Disponibles</h1>
          <p className="mt-2 text-muted-foreground">Encuentra el parqueadero ideal para tu vehículo</p>
        </div>

        {lotsWithAvailability && lotsWithAvailability.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lotsWithAvailability.map((lot) => (
              <Card key={lot.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative h-44 bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="absolute bottom-4 left-4">
                    <Badge variant={lot.available_spots > 0 ? "default" : "destructive"} className="text-sm">
                      {lot.available_spots > 0 ? `${lot.available_spots} espacios disponibles` : "Sin disponibilidad"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold text-foreground">{lot.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {lot.address}, {lot.city}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {(lot.opening_time as string).slice(0, 5)} - {(lot.closing_time as string).slice(0, 5)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {lot.spot_types.standard > 0 && (
                      <Badge variant="outline" className="gap-1">
                        {getSpotTypeIcon("standard")}
                        {lot.spot_types.standard}
                      </Badge>
                    )}
                    {lot.spot_types.handicapped > 0 && (
                      <Badge variant="outline" className="gap-1">
                        {getSpotTypeIcon("handicapped")}
                        {lot.spot_types.handicapped}
                      </Badge>
                    )}
                    {lot.spot_types.motorcycle > 0 && (
                      <Badge variant="outline" className="gap-1">
                        {getSpotTypeIcon("motorcycle")}
                        {lot.spot_types.motorcycle}
                      </Badge>
                    )}
                    {lot.spot_types.electric > 0 && (
                      <Badge variant="outline" className="gap-1">
                        {getSpotTypeIcon("electric")}
                        {lot.spot_types.electric}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">${lot.hourly_rate.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">por hora</p>
                    </div>
                    <Button asChild disabled={lot.available_spots === 0}>
                      <Link href={`/parking-lots/${lot.id}`}>
                        {lot.available_spots > 0 ? "Ver y Reservar" : "Ver Detalles"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Car className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No hay parqueaderos disponibles</h3>
            <p className="mt-2 text-sm text-muted-foreground">Vuelve a intentar más tarde</p>
          </Card>
        )}
      </main>
    </div>
  )
}
