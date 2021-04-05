const { events_model, sequelize } = require('../../../models');
class eventController {
  async index(req, res, next) {
    const model = await events_model.findAll({
      raw: true,
      limit: 50,
      order: [
        ['createdAt', 'DESC']
      ],
      attributes: ['content', 'createdAt']
    })
    console.log(model);
    res.json({ code: 200, data: model, message: "success" })
  }


}
module.exports = new eventController();