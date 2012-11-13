# twitterwalljs

Based on a jQuery plugin this simple script allows to build your very own twitterwall with pure javascript! A twitter wall is nothing else then a collection of tweets to a specific "hashtag". Automatically from time to time the plugin refresehes the screen and adds the new tweets found to the tag.

It is nearly complete css-based and can be styled easily in any way you like.

![Twitterwall screenshot](https://raw.github.com/robbz/twitterwalljs/master/screenshot.png)

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
refresh: true,
refreshTimeout: 15000,            
maxTweetsInWall: 200,
firstLoadResults: 100,
apiUrl: 'http://search.twitter.com/search.json?callback=?&result_type=recent&q=' + search
```

* Please note that the twitter API limits the max results on the first load too 100.
* For editing the style please use the given css file.
* This plugin is completely based on the client, that means you won't need any server logic.
* For more information see this <a href="http://devangelist.de/twitterwall-mit-javascript-twitterwalljs/">blog-post</a> (german).

#Demo:

A demo can be found on <a href="http://www.twitterwall.it/de/events/tmc/twitterwall.aspx">twitterwall.it</a>.