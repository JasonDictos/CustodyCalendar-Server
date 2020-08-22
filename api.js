async function locateOrCreateCalendar(gcal, ucal) {
    var res = await gcal.calendarList.list();
    for (const cal of res.data.items) {
        if (cal.summary === ucal.summary && cal.timeZone === ucal.timeZone)
            return cal.id;
    }

    // Not found so provision it
    res = await gcal.calendars.insert({resource: {
        summary: ucal.summary,
        timeZone: ucal.timeZone 
    }});

    return res.data.id;
}

module.exports.locateOrCreateCalendar = locateOrCreateCalendar;