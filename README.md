# twitterwalljs

This jQuery plugin shows all recent twitter feeds to a specified hashtag.

#### Create a twitter wall for the tag "javascript"

Include the javascript and css file in your website and call the plugin:

``` html
<link rel="stylesheet" href="twitterwalljs.css" />
<script type="text/javascript" src="twitterwalljs.js"></script>
```

```javascript
$(document).ready(function () {
    $("#twitterWall").twitterWall("javascript", { refresh: true, refreshTimeout: 5000 });
});
```

#Options:

```
showDate: true,
showUserImage: true,
showUser: true,
showTriangle: true,
refresh: true,
refreshTimeout: 15000,            
maxTweetsInWall: 200,
firstLoadResults: 100,
apiUrl: 'http://search.twitter.com/search.json?callback=?&result_type=recent&q=' + search
```

* Please note that the twitter API limits the max results on the first load too 100.
* For editing the style please use the given css file.

A demo can be found on <a href="http://www.twitterwall.it/de/events/tmc/twitterwall.aspx">twitterwall.it</a>