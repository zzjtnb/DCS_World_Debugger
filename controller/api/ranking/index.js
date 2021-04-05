const { servers_model, users_model, sequelize } = require('../../../models');
class rankingController {
  index(req, res, next) {
    users_model.findAll({
      raw: true,
      limit: 5,
      order: [
        ['kills_planes', 'DESC'],
        ['crashes', 'DESC'],
        ['teamkills', 'DESC']
        // [sequelize.fn('max', sequelize.col('kills_planes')), 'DESC'],
        // [sequelize.fn('max', sequelize.col('crashes')), 'DESC'],
        // [sequelize.fn('max', sequelize.col('teamkills')), 'DESC'],
      ],
      attributes: ['name', 'kills_planes', 'crashes', 'teamkills']
    }).then((result) => {
      res.json({ code: 200, data: result, message: "success" })
    }).catch((err) => {
      res.status(500).json({ code: 200, message: "success" })
    });
  }
  async kill(req, res, next) {
    const model = await users_model.findAll({
      raw: true,
      limit: 5,
      order: [['kills_planes', 'DESC']],
      attributes: ['name', 'kills_planes']
    })

    res.json({ code: 200, data: model, message: "success" })
  }
  async crashes(req, res, next) {
    const model = await users_model.findAll({
      raw: true,
      limit: 5,
      order: [['crashes', 'DESC']],
      attributes: ['name', 'crashes']
    })

    res.json({ code: 200, data: model, message: "success" })
  }

}
module.exports = new rankingController();