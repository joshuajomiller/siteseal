var express = require('express');
var router = express.Router();
let SiteCrawler = require('../controllers/crawler');


/* GET home page. */
router.get('/:term/:depth', function(req, res, next) {
  let sc = new SiteCrawler(res);
  let term = req.params.term;
  let depth = req.params.depth;
  console.log('term ' + term);
  sc.crawl('https://www.bbc.com', 'https://www.bbc.com/', term, null, 0, depth);
});

module.exports = router;
