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
import type { TopAgency } from "@/types/api/dashboard"

interface TopAgenciesChartProps {
  data: TopAgency[]
}

export const TopAgenciesChart = ({ data }: TopAgenciesChartProps) => {
  return (
    <Card className="border-0 shadow-sm bg-[#1a2332]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Top Agencies</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis
              dataKey="agencyName"
              angle={-45}
              textAnchor="end"
              height={100}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
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
            <Bar dataKey="revenue" fill="#4a9eff" name="Revenue" radius={[8, 8, 0, 0]} />
            <Bar dataKey="bookings" fill="#10b981" name="Bookings" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


















