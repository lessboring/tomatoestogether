/**
 * @class Autolinker
 * @extends Object
 * @singleton
 * 
 * Singleton class which exposes the {@link #link} method, used to process a given string of text,
 * and wrap the URLs, email addresses, and Twitter handles in the appropriate anchor (&lt;a&gt;) tags.
 */
var Autolinker = {
	
	// NOTE: The matcherRegex will be included after the class, from the compiled regex source
	
	
	/**
	 * @private
	 * @property {RegExp} htmlRegex
	 * 
	 * A regular expression used to pull out HTML tags from a string.
	 * 
	 * Capturing groups:
	 * 
	 * 1. If it is an end tag, this group will have the '/'.
	 * 2. The tag name.
	 */
	htmlRegex : /<(\/)?(\w+)(?:(?:\s+\w+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g,


	/**
	 * @private
	 * @property {RegExp} prefixRegex
	 * 
	 * A regular expression used to remove the 'http://' or 'https://' and/or the 'www.' from URLs.
	 */
	prefixRegex: /^(https?:\/\/)?(www\.)?/,
	
	
	/**
	 * Automatically links URLs, email addresses, and Twitter handles found in the given chunk of HTML. 
	 * Does not link URLs found within HTML tags.
	 * 
	 * For instance, if given the text: `You should go to http://www.yahoo.com`, then the result
	 * will be `You should go to &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
	 * 
	 * @method link
	 * @param {String} html The HTML text to link URLs within.
	 * @param {Object} [options] Any options for the autolinking, specified in an object. It may have the following properties:
	 * @param {Boolean} [options.newWindow=true] True if the links should open in a new window, false otherwise.
	 * @param {Boolean} [options.stripPrefix=true] True if 'http://' or 'https://' and/or the 'www.' should be stripped from the beginning of links, false otherwise.
	 * @param {Number} [options.truncate] A number for how many characters long URLs/emails/twitter handles should be truncated to
	 *   inside the text of a link. If the URL/email/twitter is over the number of characters, it will be truncated to this length by 
	 *   adding a two period ellipsis ('..') into the middle of the string.
	 *   Ex: a url like 'http://www.yahoo.com/some/long/path/to/a/file' truncated to 25 characters might look like this: 'http://www...th/to/a/file'
	 * @return {String} The HTML text, with URLs automatically linked
	 */
	link : function( html, options ) {
		options = options || {};
		
		var htmlRegex = Autolinker.htmlRegex,         // full path for friendly
		    matcherRegex = Autolinker.matcherRegex,   // out-of-scope calls
		    newWindow = ( 'newWindow' in options ) ? options.newWindow : true,  // defaults to true
		    stripPrefix = ( 'stripPrefix' in options ) ? options.stripPrefix : true,  // defaults to true
		    truncate = options.truncate,
		    currentResult, 
		    lastIndex = 0,
		    inBetweenTagsText,
		    resultHtml = "",
		    anchorTagStackCount = 0;
		
		// Function to process the text that lies between HTML tags. This function does the actual wrapping of
		// URLs with anchor tags.
		function autolinkText( text ) {
			text = text.replace( matcherRegex, function( match, $1, $2, $3, $4, $5 ) {
				var twitterMatch = $1,
				    twitterHandlePrefixWhitespaceChar = $2,  // The whitespace char before the @ sign in a Twitter handle match. This is needed because of no lookbehinds in JS regexes
				    twitterHandle = $3, // The actual twitterUser (i.e the word after the @ sign in a Twitter handle match)
				    emailAddress = $4,   // For both determining if it is an email address, and stores the actual email address
				    
				    prefixStr = "",     // A string to use to prefix the anchor tag that is created. This is needed for the Twitter handle match
				    anchorHref = "",
				    anchorText = "";
				
				
				var anchorAttributes = [];
				anchorHref = match;  // initialize both of these
				anchorText = match;  // values as the full match
				
				// Process the urls that are found. We need to change URLs like "www.yahoo.com" to "http://www.yahoo.com" (or the browser
				// will try to direct the user to "http://jux.com/www.yahoo.com"), and we need to prefix 'mailto:' to email addresses.
				if( twitterMatch ) {
					prefixStr = twitterHandlePrefixWhitespaceChar;
					anchorHref = 'https://twitter.com/' + twitterHandle;
					anchorText = '@' + twitterHandle;
				
				} else if( emailAddress ) {
					anchorHref = 'mailto:' + emailAddress;
					anchorText = emailAddress;
				
				} else if( !/^[A-Za-z]{3,9}:/i.test( anchorHref ) ) {  // string doesn't begin with a protocol, add http://
					anchorHref = 'http://' + anchorHref;   // handle all other urls by prefixing 'http://'
				}

				if ( stripPrefix ) {
					anchorText = anchorText.replace( Autolinker.prefixRegex, '' );
				}

				// remove trailing slash
				if( anchorText.charAt( anchorText.length - 1 ) === '/' ) {
					anchorText = anchorText.slice( 0, -1 );
				}
				
				// Set the attributes for the anchor tag
				anchorAttributes.push( 'href="' + anchorHref + '"' );
				if( newWindow ) {
					anchorAttributes.push( 'target="_blank"' );
				}
				
				// Truncate the anchor text if it is longer than the provided 'truncate' option
				if( truncate && anchorText.length > truncate ) {
					anchorText = anchorText.substring( 0, truncate - 2 ) + '..';
				}
				
				return prefixStr + '<a ' + anchorAttributes.join( " " ) + '>' + anchorText + '</a>';  // wrap the match in an anchor tag
			} );
			
			return text;
		}
		
		
		// Loop over the HTML string, ignoring HTML tags, and processing the text that lies between them,
		// wrapping the URLs in anchor tags 
		while( ( currentResult = htmlRegex.exec( html ) ) !== null ) {
			var tagText = currentResult[ 0 ],
			    tagName = currentResult[ 2 ],
			    isClosingTag = !!currentResult[ 1 ];
			
			inBetweenTagsText = html.substring( lastIndex, currentResult.index );
			lastIndex = currentResult.index + tagText.length;
			
			// Process around anchor tags, and any inner text / html they may have
			if( tagName === 'a' ) {
				if( !isClosingTag ) {  // it's the start <a> tag
					anchorTagStackCount++;
					resultHtml += autolinkText( inBetweenTagsText );
					
				} else {     // it's the end </a> tag
					anchorTagStackCount--;	
					if( anchorTagStackCount === 0 ) {
						resultHtml += inBetweenTagsText;  // We hit the matching </a> tag, simply add all of the text from the start <a> tag to the end </a> tag without linking it
					}
				}
				
			} else if( anchorTagStackCount === 0 ) {   // not within an anchor tag, link the "in between" text
				resultHtml += autolinkText( inBetweenTagsText );
			}
			
			resultHtml += tagText;  // now add the text of the tag itself verbatim
		}
		
		// Process any remaining text after the last HTML element. Will process all of the text if there were no HTML elements.
		if( lastIndex < html.length ) {
			resultHtml += autolinkText( html.substring( lastIndex ) );
		}
		
		return resultHtml;
	}

};

Autolinker.matcherRegex = (function() {
    var twitterRegex = /(^|\s)@(\w{1,15})/,                 // For matching a twitter handle. Ex: @gregory_jacobs

        emailRegex = /(?:[\-;:&=\+\$,\w\.]+@)/,             // something@ for email addresses (a.k.a. local-part)

        protocolRegex = /(?:[A-Za-z]{3,9}:(?:\/\/)?)/,      // match protocol, allow in format http:// or mailto:
        wwwRegex = /(?:www\.)/,                             // starting with 'www.'
        domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,  // anything looking at all like a domain, non-unicode domains, not ending in a period
        tldRegex = /\.(?:biz|br|cc|co\.uk|com|de|edu|fr|gov|hu|info|io|me|mil|mobi|name|net|org|ru|tv|us|ws)/,   // match our known top level domains (TLDs)

        pathRegex = /(?:\/(?:[\+~%\/\.\w\-]*[\+~%\/\w\-])?)?/,  // allow optional /path
        queryStringRegex = /(?:\?[\-\+=&;%@\.\w]*)?/,       // allow optional query string starting with ? 
        hashRegex = /(?:#[\-\.\!\/\\\w%]*)?/;               // allow optional hash anchor #anchor 


    return new RegExp( [
        '(',  // *** Capturing group $1, which can be used to check for a twitter handle match. Use group $3 for the actual twitter handle though. $2 may be used to reconstruct the original string in a replace() 
            // *** Capturing group $2, which matches the whitespace character before the '@' sign (needed because of no lookbehinds), and 
            // *** Capturing group $3, which matches the actual twitter handle
            twitterRegex.source,
        ')',

        '|',

        '(',  // *** Capturing group $4, which is used to determine an email match
            emailRegex.source,
            domainNameRegex.source,
            tldRegex.source,
        ')',

        '|',

        '(',  // *** Capturing group $5, which is used to match a URL
            '(?:', // parens to cover match for protocol (optional), and domain
                '(?:',  // non-capturing paren for a protocol-prefixed url (ex: http://google.com) 
                    protocolRegex.source,
                    domainNameRegex.source,
                ')',

                '|',

                '(?:',  // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
                    wwwRegex.source,
                    domainNameRegex.source,
                ')',

                '|',

                '(?:',  // non-capturing paren for known a TLD url (ex: google.com)
                    domainNameRegex.source,
                    tldRegex.source,
                ')',
            ')',

            '(?:',  // parens to cover match for path, query string, and hash anchor
                pathRegex.source,
                queryStringRegex.source,
                hashRegex.source,
            ')?',  // make this section optional
        ')'
    ].join( "" ), 'g' );
})();
