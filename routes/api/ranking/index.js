const router = require('express').Router();
const ranking = require('../../../controller/api/ranking')
// router.use((req, res, next) => {
//   console.log(req.ip);
//   next()
// })
router.get('/', ranking.index);
router.get('/kill', ranking.kill);
router.get('/crashes', ranking.crashes);
module.exports = router;
