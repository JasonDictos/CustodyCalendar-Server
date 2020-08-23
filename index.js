// Require google from googleapis package.
const { google } = require('googleapis')
const fs = require('fs')
const api = require('./api')
const { DateTime }= require('luxon')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  '113827008761-lof4bu1pe7f2ncv2kv6u06blod8ss41j.apps.googleusercontent.com',
  'F3bwI_9yG9lhr4UoYH9MQpl2'
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  refresh_token: '1//04qmEG5PjeaWnCgYIARAAGAQSNwF-L9Ir3GmWbwV-UCtkJJbVgTaoPXk1C0122vnGCqrEA7iHgwgQEq0rvPsejceTXzCdNx0qVwI'
})

// Create a new calender instance.
const gcal = google.calendar({ version: 'v3', auth: oAuth2Client })

// Load the schedule
const schedule = JSON.parse(fs.readFileSync('./schedule.json'));

(async function() {
  // Locate/provision our custody calendar
  if (!schedule.calendarId) {
    schedule.calendarId = await api.locateCalendar(gcal, schedule, true);
    console.log(`Custody Calendar processing events for calendar: ${schedule.summary}:${schedule.calendarId}`);
  }
  console.log(`${schedule.start} (${schedule.interval}/${schedule.intervals})`);

  // Now apply the events from start to end in the schedule
  let now = DateTime.fromISO(schedule.start);
  console.log(now.hour);
  while (schedule.interval < schedule.intervals) {
    const ctx = api.initCtx(now, schedule);

    console.log(`Processing interval at time ${now.toLocaleString(DateTime.DATETIME_SHORT)}`);

    for (var eventId = 0; eventId < schedule.events.length; eventId++) {
      if (!api.processEventLine(ctx, schedule.events[eventId]))
        continue;
      break;
    }

      // If the kids need a home...
    if (ctx.start && ctx.end && Object.keys(ctx.parent).length) {
        // Find them one (there better be one! otherwise this
        // means the schedule represents a possible invalid definition
        await api.createEvent(ctx, gcal);
        now = ctx.end;
        schedule.interval++;
        continue;
      }

    throw new Error(`Kids have no home on ${now.toLocaleString(DateTime.DATETIME_HUGE)}!!`);
  }

})();