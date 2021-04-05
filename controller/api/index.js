const { servers_model, users_model } = require('../../models');

class apiController {
  index(req, res, next) {
    console.log(req);
    res.json({ code: 200, message: "Hello World" })
  }
}
module.exports = new apiController();