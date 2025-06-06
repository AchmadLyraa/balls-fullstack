"use client";

import {
  ComposedChart,
  Area,
  Bar,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
} from "recharts";

export interface BookingAnalyticsProps {
  data: { name: string; count: number; duration: number }[];
}

export default function BookingAnalytics({ data }: BookingAnalyticsProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="duration"
          fill="#8884d8"
          stroke="#8884d8"
        />
        <Bar dataKey="count" barSize={20} fill="#413ea0" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
