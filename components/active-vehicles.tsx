"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Clock, MapPin } from "lucide-react"

interface ParkingRecord {
  id: string
  vehicle_plate: string
  vehicle_type: string
  entry_time: string
  parking_spot_id: string
  spot_number: string | null
  parking_lot_name: string | null
  hourly_rate: number
}

interface ActiveVehiclesProps {
  records: ParkingRecord[]
}

export function ActiveVehicles({ records }: ActiveVehiclesProps) {
  const router = useRouter()
  const [selectedRecord, setSelectedRecord] = useState<ParkingRecord | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isLoading, setIsLoading] = useState(false)

  const calculateAmount = (entryTime: string, hourlyRate: number) => {
    const entry = new Date(entryTime)
    const now = new Date()
    const hours = Math.ceil((now.getTime() - entry.getTime()) / (1000 * 60 * 60))
    return Math.max(1, hours) * hourlyRate
  }

  const formatDuration = (entryTime: string) => {
    const entry = new Date(entryTime)
    const now = new Date()
    const diffMs = now.getTime() - entry.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const handleCheckout = async () => {
    if (!selectedRecord) return
    setIsLoading(true)

    const supabase = createClient()
    const amount = calculateAmount(selectedRecord.entry_time, selectedRecord.hourly_rate)

    try {
      // Update parking record
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081/api"
      const resp = await fetch(`${apiBase}/parking-records/${selectedRecord.id}/checkout`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      })
      if (!resp.ok) throw new Error("Error en checkout")

      setSelectedRecord(null)
      router.refresh()
    } catch (error) {
      console.error("Error processing checkout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (records.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">No hay vehículos activos en este momento</p>
  }

  return (
    <>
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {records.map((record) => (
          <div key={record.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {record.vehicle_plate}
                </Badge>
                <Badge variant="secondary">{record.vehicle_type}</Badge>
              </div>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {record.parking_lot_name ?? ""} - {record.spot_number ?? ""}
              </p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(record.entry_time)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                ${calculateAmount(record.entry_time, record.hourly_rate).toLocaleString()}
              </p>
              <Button size="sm" onClick={() => setSelectedRecord(record)}>
                Registrar Salida
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Salida</DialogTitle>
            <DialogDescription>Confirma el pago y registra la salida del vehículo</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placa:</span>
                  <span className="font-mono font-medium">{selectedRecord.vehicle_plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Espacio:</span>
                  <span>{selectedRecord.parking_spot.spot_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duración:</span>
                  <span>{formatDuration(selectedRecord.entry_time)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium">Total a pagar:</span>
                  <span className="text-xl font-bold text-primary">
                    $
                    {calculateAmount(
                      selectedRecord.entry_time,
                      selectedRecord.parking_spot.parking_lot.hourly_rate,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>
              Cancelar
            </Button>
            <Button onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? "Procesando..." : "Confirmar Pago y Salida"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
