"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { RevenueTrendDataPoint } from "@/types/api/dashboard"

interface RevenueTrendChartProps {
  data: RevenueTrendDataPoint[]
}

export const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => {
  return (
    <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3" />
          Revenue Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAgency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8' }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8' }}
              tickLine={{ stroke: '#475569' }}
              tickFormatter={(value) => `₹${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155', 
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
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
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Total Revenue"
              dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#1e293b' }}
              activeDot={{ r: 7, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="adminRevenue"
              stroke="#10b981"
              strokeWidth={3}
              name="Admin Revenue"
              dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#1e293b' }}
              activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="agencyRevenue"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Agency Revenue"
              dot={{ fill: '#f59e0b', r: 5, strokeWidth: 2, stroke: '#1e293b' }}
              activeDot={{ r: 7, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}  