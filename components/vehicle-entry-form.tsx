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

interface ParkingLot {
  id: string
  name: string
  hourly_rate: number
  availableSpots: ParkingSpot[]
}

interface VehicleEntryFormProps {
  parkingLots: ParkingLot[]
  employeeId: string
}

export function VehicleEntryForm({ parkingLots, employeeId }: VehicleEntryFormProps) {
  const router = useRouter()
  const [selectedLot, setSelectedLot] = useState("")
  const [selectedSpot, setSelectedSpot] = useState("")
  const [vehiclePlate, setVehiclePlate] = useState("")
  const [vehicleType, setVehicleType] = useState("car")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const currentLot = parkingLots.find((lot) => lot.id === selectedLot)
  const availableSpots = currentLot?.availableSpots || []

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081/api"
      const resp = await fetch(`${apiBase}/parking-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parkingSpotId: selectedSpot,
          vehiclePlate: vehiclePlate.toUpperCase(),
          vehicleType,
          registeredBy: employeeId,
        }),
      })
      if (!resp.ok) throw new Error("Error al registrar entrada")

      setSuccess(`Vehículo ${vehiclePlate.toUpperCase()} registrado correctamente`)
      setVehiclePlate("")
      setSelectedSpot("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar entrada")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lot">Parqueadero</Label>
        <Select
          value={selectedLot}
          onValueChange={(value) => {
            setSelectedLot(value)
            setSelectedSpot("")
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un parqueadero" />
          </SelectTrigger>
          <SelectContent>
            {parkingLots.map((lot) => (
              <SelectItem key={lot.id} value={lot.id}>
                {lot.name} ({lot.availableSpots.length} disponibles)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLot && (
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
      )}

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

      <div className="space-y-2">
        <Label htmlFor="vehicleType">Tipo de Vehículo</Label>
        <Select value={vehicleType} onValueChange={setVehicleType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">
              <span className="flex items-center gap-2">
                <Car className="h-4 w-4" /> Automóvil
              </span>
            </SelectItem>
            <SelectItem value="motorcycle">
              <span className="flex items-center gap-2">
                <Bike className="h-4 w-4" /> Motocicleta
              </span>
            </SelectItem>
            <SelectItem value="electric">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" /> Eléctrico
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <Button type="submit" className="w-full" disabled={isLoading || !selectedSpot}>
        {isLoading ? "Registrando..." : "Registrar Entrada"}
      </Button>
    </form>
  )
}
