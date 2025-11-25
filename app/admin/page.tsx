import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { Building2, Car, DollarSign, Users } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get statistics
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: totalLots } = await supabase.from("parking_lots").select("*", { count: "exact", head: true })

  const { data: allSpots } = await supabase.from("parking_spots").select("is_available")

  const { data: allPayments } = await supabase.from("payments").select("amount").eq("payment_status", "completed")

  const totalSpots = allSpots?.length || 0
  const occupiedSpots = allSpots?.filter((s) => !s.is_available).length || 0
  const totalRevenue = allPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  const { data: parkingLots } = await supabase
    .from("parking_lots")
    .select(`
      *,
      parking_spots (id, is_available)
    `)
    .order("name")

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Administrador</h1>
            <p className="mt-2 text-muted-foreground">Gestiona parqueaderos y usuarios</p>
          </div>
          <Button asChild>
            <Link href="/admin/parking-lots/new">Nuevo Parqueadero</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{totalUsers || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Parqueaderos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{totalLots || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ocupación</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {occupiedSpots}/{totalSpots}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0}% ocupado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Parqueaderos</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/parking-lots">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parkingLots?.map((lot) => {
                  const available =
                    lot.parking_spots?.filter((s: { is_available: boolean }) => s.is_available).length || 0
                  const total = lot.parking_spots?.length || 0
                  const occupancy = total > 0 ? Math.round(((total - available) / total) * 100) : 0

                  return (
                    <div key={lot.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{lot.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {lot.address}, {lot.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium">
                            {available}/{total}
                          </p>
                          <p className="text-xs text-muted-foreground">{occupancy}% ocupado</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${lot.hourly_rate.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">por hora</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/parking-lots/${lot.id}`}>Editar</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
