let Crawler = require("crawler");

class SiteCrawler {

    constructor() {
        let self = this;
        this.previous = [];
        this.hits = [];
        this.completed = 0;
        this.c = new Crawler(
            {
                maxConnections: 100
            }
        );
        this.drainSet = false;
    }

    crawl(url, searchKey, response){
        let self = this;
        //TODO implement self.previous using https://github.com/mike442144/seenreq
        self.previous.push(url);
        self.c.queue({
            uri: url,
            callback: function (err, res, done) {
                if (err) throw err;
                try {
                    let $ = res.$;
                    let content = $('body').text();
                    // console.log(content);
                    if (content.indexOf(searchKey) !== -1){
                        self.hits.push(url);
                    }
                    let urls = $("a");
                    //console.log(urls);
                    Object.keys(urls).forEach((item) => {
                        if (urls[item].type === 'tag') {
                            self.parseUrl()
                        }
                    });
                    self.completed++;
                    done();
                } catch (e) {
                    console.error(`Encountered an error crawling ${url}. Aborting crawl.`);
                    self.completed++;
                    done();
                }
            }
        });

        if (!this.drainSet) {
            this.drainSet = true;
            this.c.on('drain', function () {
                console.log(self.completed + ' of ' + self.previous.length);
                response.send({hits: self.hits, urls: self.previous});
            });
        }
    };

    parseUrl(url){
        let href = urls[item].attribs.href;
        if (href && self.validUrl(href, url)) {
            href = href.trim();
            href = href.startsWith('http') ? href : `${url}${href}`; // The latter might need extra code to test if its the same site and it is a full domain with no URI
            // console.log(self.previous);
            self.crawl(href, searchKey);
        }
    }

    validUrl(url, base){
        let crawled = this.previous.includes(url);
        // console.log(crawled ? 'crawled' : 'not crawled');
        url = url.trim();
        let isValid = !url.includes('javascript:;') && (url.indexOf('mailto:') !== 0) && ((url.indexOf(base) === 0) || url[0] === '/');
        // console.log("url: " + url + " - crawled: " + crawled + " - valid: " + isValid);
        return (isValid && !crawled);
    }
}

module.exports = SiteCrawler;