var express = require('express');
var router = express.Router();
let SiteCrawler = require('../controllers/crawler');


/* GET home page. */
router.get('/:term', function(req, res, next) {
  let sc = new SiteCrawler();
  let term = req.params.term;
  console.log('term ' + term);
  sc.crawl('http://thesitemill.com', term, res);
});



module.exports = router;
