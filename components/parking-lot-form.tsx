"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ParkingLot {
  id: string
  name: string
  address: string
  city: string
  hourly_rate: number
  opening_time: string
  closing_time: string
  is_active: boolean
}

interface ParkingLotFormProps {
  parkingLot?: ParkingLot
}

export function ParkingLotForm({ parkingLot }: ParkingLotFormProps) {
  const router = useRouter()
  const isEditing = !!parkingLot

  const [name, setName] = useState(parkingLot?.name || "")
  const [address, setAddress] = useState(parkingLot?.address || "")
  const [city, setCity] = useState(parkingLot?.city || "")
  const [hourlyRate, setHourlyRate] = useState(parkingLot?.hourly_rate?.toString() || "")
  const [openingTime, setOpeningTime] = useState(parkingLot?.opening_time?.slice(0, 5) || "06:00")
  const [closingTime, setClosingTime] = useState(parkingLot?.closing_time?.slice(0, 5) || "22:00")
  const [isActive, setIsActive] = useState(parkingLot?.is_active ?? true)
  const [standardSpots, setStandardSpots] = useState("")
  const [motorcycleSpots, setMotorcycleSpots] = useState("")
  const [handicappedSpots, setHandicappedSpots] = useState("")
  const [electricSpots, setElectricSpots] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const totalSpots =
        (Number.parseInt(standardSpots) || 0) +
        (Number.parseInt(motorcycleSpots) || 0) +
        (Number.parseInt(handicappedSpots) || 0) +
        (Number.parseInt(electricSpots) || 0)

      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081/api"
      if (isEditing) {
        const resp = await fetch(`${apiBase}/parking-lots/${parkingLot.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            address,
            city,
            hourlyRate: Number.parseFloat(hourlyRate),
            openingTime,
            closingTime,
            isActive: isActive,
          }),
        })
        if (!resp.ok) throw new Error("Error al actualizar")
      } else {
        const resp = await fetch(`${apiBase}/parking-lots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            address,
            city,
            hourlyRate: Number.parseFloat(hourlyRate),
            openingTime,
            closingTime,
            isActive: isActive,
            standardSpots: Number.parseInt(standardSpots) || 0,
            motorcycleSpots: Number.parseInt(motorcycleSpots) || 0,
            handicappedSpots: Number.parseInt(handicappedSpots) || 0,
            electricSpots: Number.parseInt(electricSpots) || 0,
          }),
        })
        if (!resp.ok) throw new Error("Error al crear")
      }

      router.push("/admin/parking-lots")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el parqueadero")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Parqueadero</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Parqueadero Centro"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bogotá" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Calle 50 #45-12"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Tarifa por Hora ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="5000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="openingTime">Hora Apertura</Label>
          <Input
            id="openingTime"
            type="time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closingTime">Hora Cierre</Label>
          <Input
            id="closingTime"
            type="time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            required
          />
        </div>
      </div>

      {!isEditing && (
        <div className="space-y-4">
          <Label>Cantidad de Espacios por Tipo</Label>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="standardSpots" className="text-sm text-muted-foreground">
                Estándar
              </Label>
              <Input
                id="standardSpots"
                type="number"
                value={standardSpots}
                onChange={(e) => setStandardSpots(e.target.value)}
                placeholder="30"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motorcycleSpots" className="text-sm text-muted-foreground">
                Motocicletas
              </Label>
              <Input
                id="motorcycleSpots"
                type="number"
                value={motorcycleSpots}
                onChange={(e) => setMotorcycleSpots(e.target.value)}
                placeholder="10"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handicappedSpots" className="text-sm text-muted-foreground">
                Discapacitados
              </Label>
              <Input
                id="handicappedSpots"
                type="number"
                value={handicappedSpots}
                onChange={(e) => setHandicappedSpots(e.target.value)}
                placeholder="5"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="electricSpots" className="text-sm text-muted-foreground">
                Eléctricos
              </Label>
              <Input
                id="electricSpots"
                type="number"
                value={electricSpots}
                onChange={(e) => setElectricSpots(e.target.value)}
                placeholder="5"
                min="0"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor="isActive">Parqueadero activo</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Parqueadero"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
