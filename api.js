const { DateTime }= require('luxon')

async function locateCalendar(gcal, ucal, provision = false) {
    var res = await gcal.calendarList.list();
    for (const cal of res.data.items) {
        if (cal.summary === ucal.summary && cal.timeZone === ucal.timeZone)
            return cal.id;
    }

    if (!provision)
        throw new Error(`Coult not locate calendar ${ucal.summary}:${ucal.timeZone}`);

    console.log(`Provisioning calendar ${ucal.summary}:${ucal.timeZone}`);
    res = await gcal.calendars.insert({resource: {
        summary: ucal.summary,
        timeZone: ucal.timeZone 
    }});

    return res.data.id;
}


function initCtx(now, schedule) {
    return {
        now,
        schedule,
        parent: {},
        start: null,
        end: null
    };
}

function processParent(ctx, parent) {
    const { schedule } = ctx;

    // Check alternative
    switch (parent) {
        case 'alternate': {
            // Alternate modulo length of parents, remainder will select
            // the next parent in the series in order of declaration
            const next = schedule.interval % schedule.parents.length;
            if (next < schedule.parents.length)
                return schedule.parents[next];
            throw new Error(`Invalid parent section ${next}`);
        }
        default: {
            // Find it by cruising the list as its not the index
            // but the friendly name within as a value
            for (i = 0; i < schedule.parents.length; i++) {
                if (schedule.parents[i].id === parent) {
                    return schedule.parents[i];
                }
            }
            throw new Error(`Invalid parent id ${parent}`);
        }
    }
}

function processWeekDay(ctx, w) {
    const { schedule } = ctx;
    const WeekDays = [
        'Invalid',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
    ];

    let [ start, end ] = w.split('-');
    start = WeekDays.indexOf(start);
    end = WeekDays.indexOf(end);
    if (start <= 0)
        throw new Error(`Invalid weekday range ${w}`);
    if (end <= 0)
        throw new Error(`Invalid weekday range ${w}`);
    var days = 0;
    if (start <= end) {
        if (ctx.now.weekday < start || ctx.now.weekday > end)
            return false;
        days = end - start;
    } else {
        if (ctx.now.weekday > start || ctx.now.weekday < end)
            return false;
        if (ctx.now.weekday < 1 || ctx.now.weekday > WeekDays.length - end)
            return false;
    }

    ctx.endWeekday = end;

    return true;
}

function processMonths(ctx, months) {
    const { schedule } = ctx;
    const Months = [
        'Invalid',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    let [start, end] = months.split('-');
    start = Months.indexOf(start);
    end = Months.indexOf(end);
    if (start <= 0)
        throw new Error(`Invalid month range ${months}`);
    if (end <= 0)
        throw new Error(`Invalid month range ${months}`);
    if (start <= end) {
        if (ctx.now.month < start || ctx.now.month > end)
            return;
    } else {
        if (ctx.now.month < start || ctx.now.month > 12)
            return false;
        if (ctx.now.month < 1 || ctx.now.month > end)
            return false;
    }

    return true;
}

function processEndTime(ctx, s, e) {
    const [ehour, eminute] = e.split(':');
    const [shour, sminute] = s.split(':');
    ctx.start = ctx.now.set({hour: parseInt(shour), weekday: ctx.now.weekday, minute: parseInt(sminute)});
    ctx.end = ctx.start.set({hour: parseInt(ehour), minute: parseInt(eminute)});
    while (ctx.end.weekday !== ctx.endWeekday)
        ctx.end = ctx.end.plus({days: 1});
}

function processEventLine(ctx, line) {
    // Format is parent,months,weekdays,startTime,endTime
    var [ parent, months, weekdays, startTime, endTime ] = line.split(',');

    console.log('Processing line', line);
    console.log(`At time ${ctx.now.toLocaleString(DateTime.DATETIME_HUGE)}`);

    parent = processParent(ctx, parent);
    if (!parent)
        return false;
    if (!processMonths(ctx, months))
        return false;
    if (!processWeekDay(ctx, weekdays))
        return false;
    processEndTime(ctx, startTime, endTime);
    ctx.parent = parent;
    return true;
}

// Builds a gcal event (meeting) representing the custody time 
async function createEvent(ctx, gcal) {
    const resource = {
        summary: ctx.parent.summary,
        location: ctx.parent.location,
        description: ctx.parent.description,
        colorId: ctx.parent.colorId,
        start: {
            dateTime: ctx.start.valueOf(),
            timeZone: 'America/Denver',
        },
        end: {
            dateTime: ctx.end.valueOf(),
            timeZone: 'America/Denver',
        }
    };

  //await gcal.calendar.events.insert({ calendarId, resource });

  console.log(`Added event ${ctx.parent.summary} ${ctx.parent.description}`,
     `\n  ${ctx.start.toLocaleString(DateTime.DATETIME_HUGE)}\n  ${ctx.end.toLocaleString(DateTime.DATETIME_HUGE)}`
  );
}

module.exports.locateCalendar = locateCalendar;
module.exports.createEvent = createEvent;
module.exports.initCtx = initCtx;
module.exports.processEventLine = processEventLine;