/**
 * Created by Sascha on 07.12.14.
 */
define([
    'store',
    'config',
    'ramda',
    'moment'
], function (store, config, r, moment) {

    var calculator = {};

    calculator.getTotalSummary = function () {

        var totals = store.selectAllTotals();

        return summarize(totals);
    };

    calculator.getWeekSummary = function () {

        var weekStart = moment()
            .hours(0)
            .minutes(0)
            .seconds(0)
            .milliseconds(0);

        while (weekStart.day() != config.weekStart) weekStart.day(weekStart.day() - 1);

        var totals = store.selectTotalsSince(weekStart.valueOf());

        return summarize(totals);
    };

    var summarize = function (totals) {
        var totalRequiredTime = r.sum(r.map(r.prop('required'))(totals));
        var totalActualTime = r.sum(r.map(r.prop('actual'))(totals));

        return {
            required: totalRequiredTime,
            actual: totalActualTime,
            difference: totalActualTime - totalRequiredTime
        };
    };

    return calculator;
});