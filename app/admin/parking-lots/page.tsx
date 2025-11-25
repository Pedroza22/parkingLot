import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, Clock, Plus, Pencil } from "lucide-react"
import { DeleteParkingLotButton } from "@/components/delete-parking-lot-button"

export default async function AdminParkingLotsPage() {
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

  const { data: parkingLots } = await supabase
    .from("parking_lots")
    .select(`
      *,
      parking_spots (id, is_available, spot_type)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Parqueaderos</h1>
            <p className="mt-2 text-muted-foreground">Administra todos los parqueaderos del sistema</p>
          </div>
          <Button asChild>
            <Link href="/admin/parking-lots/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Parqueadero
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {parkingLots?.map((lot) => {
            const available = lot.parking_spots?.filter((s: { is_available: boolean }) => s.is_available).length || 0
            const total = lot.parking_spots?.length || 0

            return (
              <Card key={lot.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-foreground">{lot.name}</h3>
                        <Badge variant={lot.is_active ? "default" : "secondary"}>
                          {lot.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {lot.address}, {lot.city}
                      </p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {lot.opening_time?.slice(0, 5)} - {lot.closing_time?.slice(0, 5)}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {available}/{total}
                        </p>
                        <p className="text-xs text-muted-foreground">Disponibles</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">${lot.hourly_rate.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">por hora</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/parking-lots/${lot.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteParkingLotButton lotId={lot.id} lotName={lot.name} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {(!parkingLots || parkingLots.length === 0) && (
            <Card className="p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No hay parqueaderos</h3>
              <p className="mt-2 text-sm text-muted-foreground">Crea tu primer parqueadero para comenzar</p>
              <Button asChild className="mt-6">
                <Link href="/admin/parking-lots/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Parqueadero
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

function Building2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}
