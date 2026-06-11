'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area } from 'recharts';

const categoryData = [
  { name: 'Technical', value: 12 },
  { name: 'Cultural', value: 8 },
  { name: 'Sports', value: 4 },
  { name: 'Workshop', value: 7 },
];

const fundingData = [
  { name: 'Hackathon', amount: 5000 },
  { name: 'Cultural Night', amount: 3000 },
  { name: 'Seminar', amount: 2200 },
];

const trendData = [
  { month: 'Jan', votes: 20 },
  { month: 'Feb', votes: 35 },
  { month: 'Mar', votes: 45 },
  { month: 'Apr', votes: 60 },
];

const engagementData = [
  { month: 'Jan', comments: 15, votes: 20, contributions: 8 },
  { month: 'Feb', comments: 21, votes: 35, contributions: 12 },
  { month: 'Mar', comments: 27, votes: 45, contributions: 15 },
  { month: 'Apr', comments: 33, votes: 60, contributions: 19 },
];

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#dc2626'];

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Analytics dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Track engagement and event performance across the campus.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} fill="#8884d8" label>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundingData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voting trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="votes" stroke="#7c3aed" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="comments" stackId="1" stroke="#2563eb" fill="#93c5fd" />
                  <Area type="monotone" dataKey="votes" stackId="1" stroke="#7c3aed" fill="#c4b5fd" />
                  <Area type="monotone" dataKey="contributions" stackId="1" stroke="#059669" fill="#86efac" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
