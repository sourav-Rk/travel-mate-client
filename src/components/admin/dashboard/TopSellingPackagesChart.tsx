"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface TopPackage {
  packageId: string
  packageName: string
  revenue: number
  bookings: number
}

interface TopSellingPackagesChartProps {
  data: TopPackage[]
}

export const TopSellingPackagesChart = ({ data }: TopSellingPackagesChartProps) => {
  return (
    <Card className="border-0 shadow-sm bg-[#1a2332]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Top Selling Packages</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis
              dataKey="packageName"
              angle={-45}
              textAnchor="end"
              height={120}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "revenue") {
                  return [`₹${value.toLocaleString()}`, "Revenue"]
                }
                return [value, "Bookings"]
              }}
              contentStyle={{ 
                backgroundColor: '#1a2332', 
                border: '1px solid #2d3748',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#94a3b8' }}
            />
            <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" radius={[8, 8, 0, 0]} />
            <Bar dataKey="bookings" fill="#ec4899" name="Bookings" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}






