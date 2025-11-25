import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { Car, Clock, DollarSign, Users } from "lucide-react"
import { VehicleEntryForm } from "@/components/vehicle-entry-form"
import { ActiveVehicles } from "@/components/active-vehicles"

export default async function EmployeeDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || (profile.role !== "employee" && profile.role !== "admin")) {
    redirect("/dashboard")
  }

  // Get today's statistics
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayRecords } = await supabase
    .from("parking_records")
    .select("*")
    .gte("entry_time", today.toISOString())

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081/api"
  const activeRes = await fetch(`${apiBase}/parking-records/active`, { cache: "no-store" })
  const activeRecords: any[] = await activeRes.json()

  const lotsRes = await fetch(`${apiBase}/parking-lots`, { cache: "no-store" })
  const parkingLots: any[] = await lotsRes.json()

  const totalVehiclesToday = 0
  const activeVehicles = activeRecords?.length || 0
  const completedToday = 0
  const todayRevenue = 0

  const lotsWithSpots = await Promise.all(
    (parkingLots || []).map(async (lot: any) => {
      const spotsRes = await fetch(`${apiBase}/parking-spots?parkingLotId=${lot.id}&availableOnly=true`, { cache: "no-store" })
      const spots = await spotsRes.json()
      return { ...lot, availableSpots: spots }
    }),
  )

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Panel de Empleado</h1>
          <p className="mt-2 text-muted-foreground">Gestiona entradas y salidas de vehículos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vehículos Hoy</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{totalVehiclesToday}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vehículos Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{activeVehicles}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Salidas Hoy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{completedToday}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recaudo Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">${todayRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Entrada de Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleEntryForm parkingLots={lotsWithSpots || []} employeeId={user.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehículos Activos ({activeVehicles})</CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveVehicles records={activeRecords || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
