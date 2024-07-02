$(document).ready(function () {

    const item_dates = [];
    let samstag = moment('2022-03-12 09:30:00');
    do {
        item_dates.push(samstag.toDate().getTime())
        samstag = samstag.add(30, 'minutes');
    } while (samstag <= moment('2022-03-12 20:00:00'));

    let sonntag = moment('2022-03-13 09:30:00');
    do {
        item_dates.push(sonntag.toDate().getTime())
        sonntag = sonntag.add(30, 'minutes');
    } while (sonntag <= moment('2022-03-13 20:00:00'));

    const groups = programm.filter(b => b['termine'].length > 0);

    const events_by_date = {};

    for(let date of item_dates) {
        events_by_date[date] = {};
        for(let p of groups) {
            const es = p['termine'].filter(t => (
                    moment(t['start']).isSameOrAfter(moment(date)) &&
                    moment(t['start']).isBefore(moment(date).add(30, 'minutes'))
                )
            ).map((t) => {
                t['start'] = moment(t['start']).toDate();
                t['end'] = moment(t['start']).add(moment.duration(t['dauer'])).toDate();
                return t;
            });
            events_by_date[date][p['id']] = es;
        }
    }

    // build HTML
    let item_html = '';
    for(let date of item_dates) {
        const epoch = date/1000;
        item_html += `<div class="item" data-hash="${epoch}">`;
        const date_object = new Date(date);
        item_html += `<div class="subitem time">${date_object.toLocaleString(navigator.language, {weekday: 'long', hour:'numeric', minute: 'numeric'})}</div>`;
        for(var group of groups) {
            item_html += `<div class="subitem events ${group.id}">&nbsp;`;
            for(let event of events_by_date[date][group.id]) {
                const left = event.start.getMinutes() === 15 ? 50 : event.start.getMinutes() === 45 ? 50 : 0;
                const date_fraction = (event.end - event.start) / 1000 / 60 / 30;
                const width = date_fraction * 100 - 2;
                item_html += `<a href="${beitrag_url}${group['id']}" class="event ${group['id']}" style="left: ${left+1}%; width:${width}%;"><b>${group['beitrag']}</b> ${event['titel']}</a>`;
            }
            item_html += `</div>`;
        }
        item_html += `</div>`;
    }
    $('#event-timeline').append($(item_html));

    // use owl carousel

    let startPosition = 'URLHash';
    const now = new Date();
    let epoch = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())) / 1000;

    const current_item = $(`[data-hash='${epoch}']`);
    if (current_item.length) {
        startPosition = current_item.index();
    }

    owl = $('.owl-carousel');
    owl.owlCarousel({
        navText: ['zurück', 'weiter'],
        nav: true,
        startPosition: startPosition,
        URLhashListener: true,
        responsive: {
            0: {
                items:1
            },
            1000: {
                items:2
            }
        }
    });
});
