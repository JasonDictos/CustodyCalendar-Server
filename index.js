// Require google from googleapis package.
const { google } = require('googleapis')
const fs = require('fs')

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
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Load the schedule
const schedule = JSON.parse(fs.readFileSync('./schedule.json'));

// Get the start of the alternate weekend schedule
const { start, range } = schedule.alternateWeekends;

console.log('Alternate weekends starting with dad on:')
console.log(`  Start: ${start}`);
console.log(`  Range: ${range}`);

// Now walk the weekly events
for (const { months, events} of schedule.weekly) {
  console.log('');
  console.log(`For the months of ${months}:`);
  for (const event of events) {
    console.log(`  Parent: ${event.parent} (${schedule.parents[event.parent].name})`);
    console.log(`    Start: ${event.start}`);
    console.log(`    End: ${event.end}`);
  }
}