import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Calendar, Clock, Car, MapPin } from "lucide-react"
import { CancelReservationButton } from "@/components/cancel-reservation-button"

export default async function ReservationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: reservations } = await supabase
    .from("reservations")
    .select(`
      *,
      parking_spot:parking_spots (
        *,
        parking_lot:parking_lots (*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            Pendiente
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Confirmada
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            Activa
          </Badge>
        )
      case "completed":
        return <Badge variant="secondary">Completada</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Reservas</h1>
            <p className="mt-2 text-muted-foreground">Gestiona tus reservas de parqueadero</p>
          </div>
          <Button asChild>
            <Link href="/parking-lots">Nueva Reserva</Link>
          </Button>
        </div>

        {reservations && reservations.length > 0 ? (
          <div className="grid gap-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {reservation.parking_spot?.parking_lot?.name}
                        </h3>
                        {getStatusBadge(reservation.status)}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {reservation.parking_spot?.parking_lot?.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          Espacio {reservation.parking_spot?.spot_number}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(reservation.start_time)}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Placa: {reservation.vehicle_plate}</Badge>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${reservation.total_amount?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>

                      {(reservation.status === "pending" || reservation.status === "confirmed") && (
                        <CancelReservationButton
                          reservationId={reservation.id}
                          parkingSpotId={reservation.parking_spot_id}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No tienes reservas</h3>
            <p className="mt-2 text-sm text-muted-foreground">Haz tu primera reserva para ver el historial aquí</p>
            <Button asChild className="mt-6">
              <Link href="/parking-lots">Ver Parqueaderos</Link>
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}
