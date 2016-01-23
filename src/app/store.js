/**
 * Created by Sascha on 07.12.14.
 */
define(['loki', 'ramda'], function (loki, r) {

    var store = {};

    store.db = new loki('overtimer.json');
    store.db.ENV = 'BROWSER';
    store.db.loadDatabase();

    var existingCollections = store.db.listCollections();

    var hasTotals = r.find(r.propEq('name', 'totals'), existingCollections);
    var totalsCollection = hasTotals ? store.db.getCollection('totals') : store.db.addCollection('totals');

    store.selectAllTotals = function () {
        return totalsCollection.find();
    };

    store.selectTotalsSince = function (from) {
        return totalsCollection.find({'timestamp': {'$gte': from}});
    };

    store.insertTotals = function (totals) {
        totalsCollection.insert(totals);
    };

    store.deleteTotalsSince = function (timestamp) {

        var totalsSince = totalsCollection.find({'timestamp': {'$gte': timestamp}});

        totalsCollection.remove(totalsSince);

        // TODO: Workaround for bug: Set maxId manually to 0 if there are no more entries
        if (totalsCollection.data.length == 0) totalsCollection.maxId = 0;
    };

    store.reset = function () {
        store.db.removeCollection('totals');
        totalsCollection = store.db.addCollection('totals');
    };

    store.save = function () {
        this.db.save();
    };

    return store;
});