/**
 * Created by Sascha on 06.12.14.
 */
define(['moment', 'config'], function (moment, config) {

    var api = {};

    api.loadEntries = function (from) {

        var params = {};

        if (from) {
            params['search[from]'] = moment(from).format('YYYY-MM-DD');
        }

        var request = createRequest('entries.json', params);

        var handleResultPage = function (data, results) {
            $.each(parseEntries(data), function (i, entry) {
                results.push(entry);
            });
        };

        return executeRequest(request, handleResultPage)
            .fail(function (err) {
                console.error('Error loading Freckle time entries: ' + err);
            });
    };

    var createRequest = function (resource, params) {

        var url = 'https://' + config.freckleSubDomain + '.letsfreckle.com/api/' + resource;
        var firstParam = true;

        $.each(params, function (key, value) {

            url += (firstParam ? '?' : '&') + key + '=' + value;
            firstParam = false;
        });

        return {
            url: url,
            headers: {
                'X-FreckleToken': config.freckleApiToken
            }
        }
    };

    var executeRequest = function (request, pageResultHandler, results) {

        var d = $.Deferred();

        $.ajax(request)
            .done(function (data, text, response) {

                results = results || [];

                pageResultHandler(data, results);

                var nextPageLink = response.getResponseHeader('Link');

                if (nextPageLink) {

                    var nextPageRequest = $.extend(true, {}, request);
                    nextPageRequest.url = extractNextPageUrl(nextPageLink);

                    executeRequest(nextPageRequest, pageResultHandler, results)
                        .done(d.resolve)
                        .fail(d.reject);

                } else {
                    d.resolve(results);
                }
            })
            .fail(d.reject);

        return d.promise();
    };

    var extractNextPageUrl = function (link) {
        return link.substring(1, link.indexOf(';') - 1);
    };

    var parseEntries = function (freckleEntries) {

        var entries = [];

        $.each(freckleEntries, function (i, freckleEntry) {

            var timestamp = moment(freckleEntry.entry.date).valueOf();
            var duration = freckleEntry.entry.minutes * 60 * 1000;

            entries.push({
                timestamp: timestamp,
                duration: duration
            });
        });

        return entries;
    };

    return api;
});
