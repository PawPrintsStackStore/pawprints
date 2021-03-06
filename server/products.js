'use strict'

const db = require('APP/db')
const Product = db.model('products')
const Review = db.model('reviews')
const {mustBeLoggedIn, forbidden, mustBeAdmin,} = require('./auth.filters')

const router = require('express').Router()

// get all products
router.get('/', (req, res, next) => {
  Product.findAll({
    include: [{all: true}]
  })
  .then(res.send.bind(res))
  .catch(next)
})

// add a new product
router.post('/', mustBeAdmin, (req, res, next) => {
  Product.findOrCreate({
    where: req.body
  })
  .then(res.send.bind(res))
  .catch(next)
})

// get one product by id
router.get('/:id', (req, res, next) => {
  Product.findById(req.params.id, {
    include: [{all: true}]
  })
  .then(res.send.bind(res))
  .catch(next)
})


// get all reviews of a product
router.get('/:id/reviews', (req, res, next) => {
  Review.findAll({
    where: {
      product_id: req.params.id
    }
  })
  .then(reviews => res.json(reviews))
  .catch(next)
})

// post a review for a product
router.post('/:id/reviews', (req, res, next) => {
  Review.create(req.body)
  .then(res.send.bind(res))
  .catch(next)
})

// update one product
router.put('/:id', mustBeAdmin, (req, res, next) => {
  Product.update(req.body, {
    where: {
      id: req.params.id
    },
    returning: true,
  })
  .then(response => response[1][0])
  .then(res.send.bind(res))
  .catch(next)
})

// delete one product
router.delete('/:id', mustBeAdmin, (req, res, next) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
    cascade: true,
  })
  .then(destroyedProduct => {
    res.status(204).send(destroyedProduct)
  })
  .catch(next)
})

module.exports = router
