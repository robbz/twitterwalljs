(function ($) {
    $.fn.twitterWall = function (search, options, tweetTemplate) {
        
        var defaults = {
            refresh: true,
            refreshTimeout: 15000,
            maxTweetsInWall: 200,
            firstLoadResults: 100,
            language: 'en',
            detectLanguage: true,
            apiUrl: 'http://search.twitter.com/search.json?callback=?&result_type=recent&q=' + search
        };
        var config = $.extend(defaults, options),
            container = $(this);

        tweetTemplate = tweetTemplate ||
            '<div class="tweet">' +
                '<div class="tweetText"><%= text %></div>' +
                '<div class="tweetTriangle"></div>' +
                '<img class="tweetImg" src="<%= profileImageUrl %>" />' +
                '<span class="tweetUser">' +
                    '<a target="_blank" href="<%= statusUrl %>"><%= userName %></a>' +
                '</span>' +
                '<span class="tweetTime">(<%= dateFromNow %>)</span>' +
            '</div>';

        if (config.detectLanguage) {
            var language = navigator.userLanguage || navigator.language;
            if (language.length > 2) {
                language = language.substr(0, 2);
            }
            config.language = language;            
        }

        var init = function () {
            load(getNextApiUrl(0), function (data) {
                for (var i = 0; i < data.results.length; i++) {
                    var tweet = $(renderTweet(data.results[i]));
                    container.find(".loader").fadeOut();
                    container.append(tweet);
                    tweet.fadeIn();
                }
            });
        };

        var refresh = function (lastId) {
            load(getNextApiUrl(lastId), function (data) {
                for (var i = 0; i < data.results.length; i++) {
                    var tweet = $(renderTweet(data.results[i]));
                    container.prepend(tweet);
                    tweet.fadeIn();
                }
                removeTweets();
            });
        };

        var load = function (url, callback) {
            $.getJSON(url, function (data) {
                callback(data);
                if (config.refresh) {
                    setTimeout(function () {
                        refresh(data.max_id_str);
                    }, config.refreshTimeout);
                }
            });
        };

        var removeTweets = function () {
            if (container.find(".tweet").length > config.maxTweetsInWall) {
                container.find(".tweet :gt(" + config.maxTweetsInWall + ")").remove();
            }
        };

        var getNextApiUrl = function (lastId) {
            return config.apiUrl + "&rpp=" + config.firstLoadResults + (lastId > 0 ? "&since_id=" + lastId : "");
        };

        var renderTweet = function(data) {
            var tweet = {
                text: replaceLinksInText(data.text),
                profileImageUrl: data.profile_image_url,
                statusUrl: createStatusUrl(data.from_user, data.id_str),
                dateFromNow: moment(data.created_at).lang(config.language).fromNow(),
                userName: data.from_user
            };
            return _.template(tweetTemplate, tweet);
        };

        var replaceLinksInText = function (text) {
            var linkTarget = config.openLinksInNewTab ? ' target="_blank"' : '';
            return text.replace(/(http:\/\/\S+)/g, '<a' + linkTarget + ' href="$1">$1</a>')
                       .replace(/\@(\w+)/g, '<a' + linkTarget + ' href="http://twitter.com/$1">@$1</a>');
        };

        var createStatusUrl = function (userName, tweetId) {
            return 'http://www.twitter.com/' + userName + '/status/' + tweetId;
        }

        init();
    }
})(jQuery);