const Sequelize = require('sequelize')
const db = require('APP/db')

const Product = db.define('product', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  urlTitle: {
    type: Sequelize.STRING
  },
  imgUrl: {
    type: Sequelize.STRING,
    defaultValue: 'http://placekitten.com/g/300/200/'
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  size: {
    type: Sequelize.STRING,
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  inventory: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  category: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false,
    validate: {
      len: [1, 10]
    },
  },

},
{
  hooks: {
    beforeValidate: function (product) {
      if (product.title) {
        product.urlTitle = product.title.replace(/\s+/g, '_').replace(/\W/g, '');
      }
    }
  },
})

// associate multiple rows as size options for each product
Product.belongsToMany(Product, {through: 'options', as: 'options'})

module.exports = Product