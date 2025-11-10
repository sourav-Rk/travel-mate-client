"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import type { RevenueDistribution } from "@/types/api/dashboard"

interface RevenueDistributionChartProps {
  data: RevenueDistribution
}

const COLORS = ["#3b82f6", "#10b981"]

export const RevenueDistributionChart = ({
  data,
}: RevenueDistributionChartProps) => {
  const chartData = [
    { name: "Admin", value: data.admin },
    { name: "Agency", value: data.agency },
  ]

  return (
    <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3" />
          Revenue Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
              </filter>
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent! * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              stroke="#1e293b"
              strokeWidth={3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ filter: 'url(#shadow)' }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155', 
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                padding: '12px'
              }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '8px' }}
              itemStyle={{ color: '#cbd5e1', padding: '4px 0' }}
              formatter={(value: number) => `₹${value.toLocaleString()}`} 
            />
            <Legend 
              wrapperStyle={{ 
                color: '#e2e8f0',
                paddingTop: '20px'
              }}
              iconType="circle"
              formatter={(value) => <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}