import { NextRequest, NextResponse } from 'next/server';

// Google Calendar API integration via Service Account
// This is a server-side API route — only runs on Vercel/Node.js

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, guests, date, time, notes } = body;

    if (!name || !guests || !date || !time) {
      return NextResponse.json({ error: 'Data reservasi tidak lengkap' }, { status: 400 });
    }

    // Build event details
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const startDateTime = new Date(year, month - 1, day, hour, minute);
    const endDateTime = new Date(startDateTime.getTime() + 90 * 60000); // 90 min duration

    const eventTitle = `Reservasi: ${name} (${guests} tamu)`;
    const eventDescription = [
      `Nama: ${name}`,
      `Jumlah Tamu: ${guests} orang`,
      `Tanggal: ${date}`,
      `Waktu: ${time}`,
      `Catatan: ${notes || '-'}`,
      '',
      '---',
      'Reservasi dari Website D\'Umeneng',
    ].join('\n');

    // Call Google Calendar API using Service Account
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!calendarId || !serviceAccountEmail || !privateKey) {
      console.warn('Google Calendar env vars not configured — skipping sync');
      return NextResponse.json({ success: false, reason: 'Google Calendar not configured' });
    }

    // Get OAuth2 token using service account
    const { google } = await import('googleapis');
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: eventTitle,
        description: eventDescription,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Asia/Jakarta',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Jakarta',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 60 },   // Popup 1 jam sebelum
            { method: 'popup', minutes: 10 },   // Popup 10 menit sebelum
            { method: 'email', minutes: 120 },  // Email 2 jam sebelum
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      eventId: event.data.id,
      eventLink: event.data.htmlLink,
    });
  } catch (error: any) {
    console.error('Calendar sync error:', error.message);
    return NextResponse.json(
      { error: 'Gagal sinkronisasi kalender', detail: error.message },
      { status: 500 }
    );
  }
}
