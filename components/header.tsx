"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Car, User, LogOut, LayoutDashboard, ClipboardList } from "lucide-react"
import type { Profile } from "@/lib/types"

interface HeaderProps {
  profile: Profile | null
}

export function Header({ profile }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const getDashboardLink = () => {
    if (!profile) return "/auth/login"
    switch (profile.role) {
      case "admin":
        return "/admin"
      case "employee":
        return "/employee"
      default:
        return "/dashboard"
    }
  }

  const getRoleLabel = () => {
    if (!profile) return ""
    switch (profile.role) {
      case "admin":
        return "Administrador"
      case "employee":
        return "Empleado"
      default:
        return "Usuario"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ParkEasy</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Inicio
          </Link>
          <Link
            href="/parking-lots"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Parqueaderos
          </Link>
          {profile && profile.role === "user" && (
            <Link
              href="/reservations"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Mis Reservas
            </Link>
          )}
          {profile && profile.role === "employee" && (
            <Link
              href="/employee"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Panel Empleado
            </Link>
          )}
          {profile && profile.role === "admin" && (
            <>
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Panel Admin
              </Link>
              <Link
                href="/employee"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Panel Empleado
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{profile.full_name || "Usuario"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile.full_name || "Usuario"}</p>
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {getRoleLabel()}
                  </span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {profile.role === "user" && (
                  <DropdownMenuItem asChild>
                    <Link href="/reservations" className="cursor-pointer">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Mis Reservas
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
