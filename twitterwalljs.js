(function ($) {
    $.fn.twitterWall = function (search, options) {
        
        var defaults = {
            showDate: true,
            showUserImage: true,
            showUser: true,
            showTriangle: true,
            refresh: true,
            refreshTimeout: 15000,
            maxTweetsInWall: 200,
            firstLoadResults: 100,
            openLinksInNewTab: true,
            apiUrl: 'http://search.twitter.com/search.json?callback=?&result_type=recent&q=' + search
        };
        var config = $.extend(defaults, options),
            container = $(this);

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
                dateFromNow: moment(data.created_at).fromNow(),
                userName: data.from_user
            };

            var result = '<div class="tweet">';
                result += '<div class="tweetText">' + tweet.text + '</div>';

            if (config.showTriangle) {
                result += '<div class="tweetTriangle"></div>';
            }            
            if (config.showUserImage) {
                result += '<img class="tweetImg" src="' + tweet.profileImageUrl + '" />';
            }
            if (config.showUser) {
                result += '<span class="tweetUser">' +
                              '<a' + (config.openLinksInNewTab ? ' target="_blank"' : '') + ' href="' + tweet.statusUrl + '">' + tweet.userName + '</a>' +
                          '</span>';
            }            
            if (config.showDate) {
                result += '<span class="tweetTime">(' + tweet.dateFromNow + ')</span>'
            }

            result += '</div>';

            return result;
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