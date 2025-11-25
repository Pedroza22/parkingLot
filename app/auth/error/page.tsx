import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Car, AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">ParkEasy</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-sm text-muted-foreground">
              {params?.error || "Ocurrió un error durante la autenticación."}
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Volver a intentar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
