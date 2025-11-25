"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CancelReservationButtonProps {
  reservationId: string
  parkingSpotId: string
}

export function CancelReservationButton({ reservationId, parkingSpotId }: CancelReservationButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    const supabase = createClient()
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081/api"
      const resp = await fetch(`${apiBase}/reservations/${reservationId}/cancel`, { method: "PATCH" })
      if (!resp.ok) throw new Error("Error al cancelar")
      router.refresh()
    } catch (error) {
      console.error("Error cancelling reservation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
          Cancelar Reserva
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cancelar esta reserva?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El espacio volverá a estar disponible para otros usuarios.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, mantener</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Cancelando..." : "Sí, cancelar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
