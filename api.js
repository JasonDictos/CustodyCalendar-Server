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
        start: DateTime,
        end: DateTime
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
                if (schedule.parents[i].id === parent)
                    return schedule.parents[i];
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
    if (start <= 0)
        throw new Error(`Invalid weekday range ${w}`);
    if (end <= 0)
        throw new Error(`Invalid weekday range ${w}`);
    if (start <= end) {
        if (ctx.now.local().weekDay < ctx.now.local({weekDay: start}) ||
                ctx.now.local().weekDay > ctx.now.local({weekDay: end}))
            return false;
    } else {
        if (ctx.now.local().weekDay < ctx.now.local({weekDay: start}) ||
                ctx.now.local().weekDay > ctx.now.local({weekDay: WeekDays.length}))
            return false;
        if (ctx.now.local().weekDay < ctx.now.local({weekDay: 1}) ||
                ctx.now.local().weekDay > ctx.now.local({weekDay: end}))
            return false;
    }

    if (!ctx.start)
        ctx.start = ctx.now;

    if (ctx.start.local().weekDay === end)
        ctx.end = ctx.start.local({ weekDay: end });

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
    if (start <= 0)
        throw new Error(`Invalid month range ${months}`);
    if (end <= 0)
        throw new Error(`Invalid month range ${months}`);
    if (start <= end) {
        if (ctx.now.local().month < ctx.now.local({month: start}) ||
                ctx.now.local().month > ctx.now.local({month: end}))
            return;
    } else {
        if (ctx.now.local().month < ctx.now.local({month: start}) ||
                ctx.now.local().month > ctx.now.local({month: 12}))
            return;
        if (ctx.now.local().month < ctx.now.local({month: 1}) ||
                ctx.now.local().month > ctx.now.local({month: end}))
            return;
    }

    if (!ctx.start)
        ctx.start = ctx.now;
}

function processStartTime(ctx, s) {
    const [hour, minute] = s.split(':');
    s.start = s.start.local({ hour, minute });
}

function processEndTime(ctx, e) {
    const [hour, minute] = e.split(':');
    s.end = s.end.local({ hour, minute });
}

function processEventLine(ctx, line) {
    // Format is parent,months,weekDays,startTime,endTime
    const [ parent, months, weekDays, startTime, endTime ] = line.split(',');

    if (!processParent(ctx, parent))
        return false;
    if (!processMonths(ctx, months))
        return false;
    if (!processWeekDay(ctx, weekDays))
        return false;
    if (!processStartTime(ctx, startTime))
        return false;
    processEndTime(ctx, endTime);
    return true;
}

// Builds a gcal event (meeting) representing the custody time 
async function createEvent(ctx, gcal, calendarId) {
    const resource = {
        summary: ctx.parent.summary,
        location: ctx.parent.location,
        description: ctx.parent.description,
        colorId: ctx.parent.colorId,
        start: {
            dateTime: ctx.start.local().toISOTime(),
            timeZone: 'America/Denver',
        },
        end: {
            dateTime: ctx.end.local().toISOTime(),
            timeZone: 'America/Denver',
        }
    };

  //await gcal.calendar.events.insert({ calendarId, resource });

  console.log(`Added event ${ctx.parent.summary} ${ctx.parent.summary}`,
     `${ctx.start.toLocaleString()} => ${ctx.end.toLocaleString()}`
  );
}

module.exports.locateCalendar = locateCalendar;
module.exports.createEvent = createEvent;
module.exports.initCtx = initCtx;
module.exports.processEventLine = processEventLine;