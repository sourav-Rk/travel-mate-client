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

interface CategoryPerformance {
  category: string
  revenue: number
  bookings: number
}

interface CategoryPerformanceChartProps {
  data: CategoryPerformance[]
}

export const CategoryPerformanceChart = ({ data }: CategoryPerformanceChartProps) => {
  return (
    <Card className="border-0 shadow-sm bg-[#1a2332]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Category Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis
              dataKey="category"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
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
              labelFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
            />
            <Legend 
              wrapperStyle={{ color: '#94a3b8' }}
            />
            <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" radius={[8, 8, 0, 0]} />
            <Bar dataKey="bookings" fill="#06b6d4" name="Bookings" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


















