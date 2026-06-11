'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const events = [
  { title: 'Hackathon', start: '2026-09-16', end: '2026-09-17', color: '#2563eb' },
  { title: 'Cultural Night', start: '2026-10-02', color: '#7c3aed' },
  { title: 'Seminar', start: '2026-10-10T10:00:00', color: '#059669' },
];

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Campus calendar</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Browse approved events by month, week, and day.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Approved events and timelines</CardTitle>
        </CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
            events={events}
            height="auto"
          />
        </CardContent>
      </Card>
    </div>
  );
}
