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

        var config = $.extend(defaults, options);
        var container = $(this);

        var load = function (lastId) {

            var apiUrl = config.apiUrl + "&rpp=" + config.firstLoadResults + (lastId > 0 ? "&since_id=" + (lastId) : "");

            $.getJSON(apiUrl, function (data) {
                $.each(data.results, function (key, value) {
                    
                    var tweet = $(renderTweet(value));

                    if (!lastId) {
                        container.find(".loader").fadeOut();
                        container.append(tweet);
                    } else {
                        container.prepend(tweet);
                    }

                    tweet.fadeIn();
                });

                if (container.find(".tweet").length > config.maxTweetsInWall) {
                    container.find(".tweet :gt(" + config.maxTweetsInWall + ")").remove();
                }

                if (config.refresh) {
                    lastId = data.max_id_str;
                    setTimeout(function () { load(lastId); }, config.refreshTimeout);
                }
            });
        };

        var renderTweet = function(data) {
            var result;
            var text = data.text;
            text = data.text.replace(/(http:\/\/\S+)/g, '<a' + (config.openLinksInNewTab ? ' target="_blank"' : '') + ' href="$1">$1</a>');
            text = text.replace(/\@(\w+)/g, '<a' + (config.openLinksInNewTab ? ' target="_blank"' : '') + ' href="http://twitter.com/$1">@$1</a>');

            result = '<div class="tweet" data-id="' + data.id + '">';
            result += '<div class="tweetText">' + text + '</div>';

            if (config.showTriangle) {
                result += '<div class="tweetTriangle"></div>';
            }
            
            if (config.showUserImage) {
                result += '<img class="tweetImg" src="' + data.profile_image_url + '" />';
            }

            if (config.showUser) {
                result += '<span class="tweetUser">' + 
                    '<a' + (config.openLinksInNewTab ? ' target="_blank"' : '') + 
                    ' href="http://www.twitter.com/' + data.from_user + '/status/' + data.id_str + '">' + data.from_user + '</a></span>';
            }
            
            if (config.showDate) {
                result += '<span class="tweetTime">(' + prettyDate(data.created_at) + ')</span>'
            }
            
            result += '</div>';
            return result;
        };

        var prettyDate = function (time) {
            var date = new Date((time || "").replace(/-/g, "/").replace(/TZ/g, " ")),
                diff = (((new Date()).getTime() - date.getTime()) / 1000),
                day_diff = Math.floor(diff / 86400);

            if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
                return;
            var v = day_diff == 0 && (
                    diff < 60 && "just now" ||
                    diff < 120 && "1 minute ago" ||
                    diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
                    diff < 7200 && "1 hour ago" ||
                    diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
                day_diff == 1 && "Yesterday" ||
                day_diff < 7 && day_diff + " days ago" ||
                day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
            if (!v)
                window.console && console.log(time);
            return v ? v : '';
        }
        load();
    }
})(jQuery);