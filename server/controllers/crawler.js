let Crawler = require("crawler");

class SiteCrawler {

    constructor(response) {
        let self = this;
        this.previous = [];
        this.hits = [];
        this.c = new Crawler(
            {
                maxConnections: 100
            }
        );

        this.c.on('drain', function () {
            console.log("Completed: " + self.previous.length);
            response.send({hits: self.hits, urls: self.previous});
        });
    }

    crawl(url, source, searchKey, base){
        let self = this;
        url = this.normalizeUrl(url, source);
        if (this.checkLink(url, base)){
            this.previous.push(url);
            this.c.queue({
                uri: url,
                callback: function (err, res, done) {
                    if (err) throw err;
                    let responseUrl = res.request.uri.href;
                    console.log('responseUrl: ' + responseUrl);
                    responseUrl = self.normalizeUrl(responseUrl, url);
                    if (self.validUrl(responseUrl, base)){
                        if (self.newUrl(responseUrl)){
                            self.previous.push(responseUrl);
                        }
                        try {
                            let $ = res.$;
                            let content = $('body').text();
                            if (content.indexOf(searchKey) !== -1) {
                                self.hits.push(url);
                            }
                            let subUrls = $("a");
                            if (Object.keys(subUrls).length) {
                                console.log('Found ' + Object.keys(subUrls).length + ' links');
                                Object.keys(subUrls).forEach((item) => {
                                    if (subUrls[item].type === 'tag') {
                                        self.crawl(subUrls[item], url, searchKey, base)
                                    }
                                });
                            }
                            done();
                        } catch (e) {
                            console.error(`Encountered an error crawling ${url}. Aborting crawl.`);
                            console.error(e);
                            done();
                        }
                    } else {
                        done();
                    }
                }
            });
        }
    };

    normalizeUrl(url, source){
        url = url.trim();
        url = new URL(url, source);
        url.hash = '';
        console.log('normalized url: ' + url);
        return url;
    }

    checkLink(url, base){
        return this.newUrl(url) && this.validUrl(url, base);
    }

    newUrl(url){
        let isNewUrl = !this.previous.includes(url);
        console.log('new url: ' + isNewUrl);
        return isNewUrl;
    }

    validUrl(url, base){
        let isHTML = !url.match(/\.(zip|jpe?g|png|mp4|gif)$/i);
        let isLink = url.indexOf('javascript:;') !== 0 && url.indexOf('mailto:') !== 0;
        let isSameBase = url.indexOf(base) === 0;
        console.log(`isHTML ${isHTML} isLink ${isLink} isSameBase ${isSameBase}`);
        return (isHTML && isLink && isSameBase);
    }
}

module.exports = SiteCrawler;