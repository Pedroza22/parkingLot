import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Car, Mail, CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
            <CardDescription>Tu cuenta ha sido creada correctamente</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-muted p-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Revisa tu correo electrónico para confirmar tu cuenta</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/auth/login">Ir a Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
