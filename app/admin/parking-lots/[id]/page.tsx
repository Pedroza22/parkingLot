import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ParkingLotForm } from "@/components/parking-lot-form"

export default async function EditParkingLotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const { data: parkingLot } = await supabase.from("parking_lots").select("*").eq("id", id).single()

  if (!parkingLot) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} />

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin/parking-lots">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a parqueaderos
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Editar Parqueadero</CardTitle>
          </CardHeader>
          <CardContent>
            <ParkingLotForm parkingLot={parkingLot} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
