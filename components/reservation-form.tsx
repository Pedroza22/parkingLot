"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Bike, Zap, Accessibility } from "lucide-react"

interface ParkingSpot {
  id: string
  spot_number: string
  spot_type: string
  is_available: boolean
}

interface ReservationFormProps {
  parkingLotId: string
  availableSpots: ParkingSpot[]
  hourlyRate: number
}

export function ReservationForm({ parkingLotId, availableSpots, hourlyRate }: ReservationFormProps) {
  const router = useRouter()
  const [selectedSpot, setSelectedSpot] = useState("")
  const [vehiclePlate, setVehiclePlate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSpotTypeIcon = (type: string) => {
    switch (type) {
      case "handicapped":
        return <Accessibility className="h-4 w-4" />
      case "motorcycle":
        return <Bike className="h-4 w-4" />
      case "electric":
        return <Zap className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  const calculateTotal = () => {
    if (!startDate || !startTime || !endDate || !endTime) return 0
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60))
    return Math.max(0, hours * hourlyRate)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Debes iniciar sesión")

      const startDateTime = new Date(`${startDate}T${startTime}`)
      const endDateTime = new Date(`${endDate}T${endTime}`)

      if (endDateTime <= startDateTime) {
        throw new Error("La fecha de fin debe ser posterior a la de inicio")
      }

      const total = calculateTotal()

      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081/api"
      const resp = await fetch(`${apiBase}/reservations?parkingLotId=${parkingLotId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          parkingSpotId: selectedSpot,
          vehiclePlate: vehiclePlate.toUpperCase(),
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
      })
      if (!resp.ok) throw new Error("Error al crear la reserva")

      router.push("/reservations")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la reserva")
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="spot">Espacio</Label>
        <Select value={selectedSpot} onValueChange={setSelectedSpot} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un espacio" />
          </SelectTrigger>
          <SelectContent>
            {availableSpots.map((spot) => (
              <SelectItem key={spot.id} value={spot.id}>
                <span className="flex items-center gap-2">
                  {getSpotTypeIcon(spot.spot_type)}
                  {spot.spot_number}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehiclePlate">Placa del Vehículo</Label>
        <Input
          id="vehiclePlate"
          placeholder="ABC123"
          value={vehiclePlate}
          onChange={(e) => setVehiclePlate(e.target.value)}
          required
          className="uppercase"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha Inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={today}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Hora Inicio</Label>
          <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha Fin</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || today}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Hora Fin</Label>
          <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
      </div>

      {calculateTotal() > 0 && (
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total estimado:</span>
            <span className="text-xl font-bold text-primary">${calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Reservando..." : "Confirmar Reserva"}
      </Button>
    </form>
  )
}
