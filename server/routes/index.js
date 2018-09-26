var express = require('express');
var router = express.Router();
let SiteCrawler = require('../controllers/crawler');


/* GET home page. */
router.get('/:term', function(req, res, next) {
  let sc = new SiteCrawler(res);
  let term = req.params.term;
  console.log('term ' + term);
  sc.crawl('http://thesitemill.com', 'http://thesitemill.com', term);
});

module.exports = router;
