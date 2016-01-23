/**
 * Created by Sascha on 07.12.14.
 */
define([
    'api',
    'store',
    'config',
    'moment',
    'ramda'
], function (api, store, config, moment, r) {

    var updater = {};
    var isExecuting = false;

    updater.update = function () {

        if (isExecuting) return;

        $(updater).trigger('updateStarted');

        console.log('Update task started');

        isExecuting = true;

        var chainStart = $.Deferred();
        var chain = chainStart;

        // Load entries
        chain = chain.then(function () {

            var from = moment();
            from
                .milliseconds(-config.updatePeriod)
                .hours(0)
                .minutes(0)
                .seconds(0)
                .milliseconds(0);

            return api.loadEntries(from);
        });

        // Calculate totals
        var totals;

        chain = chain.then(function (entries) {

            console.log('Loaded ' + entries.length + ' time entries');

            totals = calculateTotals(entries);
        });

        // Save totals
        chain = chain.then(function() {

            // Find minimum date
            var minDate = r.min(r.map(r.prop('timestamp'))(totals));

            console.log('Deleting totals since ' + moment(minDate).format('YYYY-MM-DD'));

            // Remove totals since minimum date
            store.deleteTotalsSince(minDate);

            // Save new totals
            console.log('Inserting ' + totals.length + ' totals');
            store.insertTotals(totals);
            store.save();
        });

        // Finish
        chain = chain.then(function () {

            console.log('Update task finished');

            isExecuting = false;

            $(updater).trigger('updateFinished');
        });

        chainStart.resolve();

        return chain;
    };

    var DailyTotalsCalculator = function (entries) {

        var totals = [];

        var dateEquals = function (e1, e2) {
            return e1.timestamp == e2.timestamp;
        };

        var uniqueDates = r.map(r.prop('timestamp'))(r.uniqWith(dateEquals)(entries));

        $.each(uniqueDates, function(i, date) {

            var entriesForDate = r.filter(r.propEq('timestamp', date))(entries);

            var total = {};
            total.timestamp = date;
            total.required = config.getRequiredTime(date);
            total.actual = r.sum(r.map(r.prop('duration'))(entriesForDate));

            totals.push(total);
        });

        return totals;
    };

    var calculateTotals = DailyTotalsCalculator;

    return updater;
});