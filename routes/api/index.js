const router = require('express').Router();
const api = require('../../controller/api')
const event = require('../../controller/api/event')
const rankingRouter = require('./ranking')
// router.use((req, res, next) => {
//   console.log(req.ip);
//   next()
// })
router.get('/', api.index);
router.get('/event', event.index);
router.use('/ranking', rankingRouter);
module.exports = router;
