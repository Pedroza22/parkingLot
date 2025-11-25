import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Calendar, Car, Clock, CreditCard } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Redirect employees and admins to their specific dashboards
  if (profile?.role === "admin") {
    redirect("/admin")
  }
  if (profile?.role === "employee") {
    redirect("/employee")
  }

  const { data: reservations } = await supabase.from("reservations").select("*").eq("user_id", user.id)

  const activeReservations =
    reservations?.filter((r) => r.status === "active" || r.status === "confirmed" || r.status === "pending").length || 0

  const completedReservations = reservations?.filter((r) => r.status === "completed").length || 0

  const totalSpent =
    reservations?.filter((r) => r.status === "completed").reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0

  const { data: recentReservations } = await supabase
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
    .limit(3)

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Hola, {profile?.full_name}</h1>
          <p className="mt-2 text-muted-foreground">Bienvenido a tu panel de control</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reservas Activas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{activeReservations}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reservas Completadas</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{completedReservations}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reservas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{reservations?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Gastado</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reservas Recientes</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/reservations">Ver todas</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentReservations && recentReservations.length > 0 ? (
                <div className="space-y-4">
                  {recentReservations.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium text-foreground">{reservation.parking_spot?.parking_lot?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Espacio {reservation.parking_spot?.spot_number} • {reservation.vehicle_plate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">${reservation.total_amount?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground capitalize">{reservation.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No tienes reservas recientes</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild className="w-full justify-start">
                <Link href="/parking-lots">
                  <Car className="mr-2 h-4 w-4" />
                  Nueva Reserva
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                <Link href="/reservations">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Mis Reservas
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
