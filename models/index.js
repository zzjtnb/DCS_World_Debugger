const db = {};
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const dbConfig = require('../config/db/sql')
const modelsPath = path.join(__dirname, 'common')
// const { db_err_sql } = require('../middleware/logger')
const { Sequelize, DataTypes, Op } = require('sequelize');
// Sequelize.prototype.query = function () {
//   return originalQuery.apply(this, arguments).catch((err) => {
//     db_err_sql(err) // log the error
//   });
// };
/**
 * 连接到数据库的示例对象
 */
const sequelize = new Sequelize(dbConfig);

fs.readdirSync(modelsPath)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(modelsPath, file))(sequelize, DataTypes)
    db[model.name] = model;
  });


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op
module.exports = db;