'use strict'

const db = require('APP/db')
const User = db.model('users')
const Review = db.model('reviews')
const Order = db.model('orders')
const LineItem = db.model('lineItems')
const Product = db.model('products')

const {mustBeLoggedIn, selfOnly, forbidden, mustBeAdmin, selfOrAdmin} = require('./auth.filters')

module.exports = require('express').Router()
  //admins can get all users
  .get('/', mustBeAdmin, (req, res, next) => User.findAll()
    .then(users => res.json(users))
    .catch(next))

  //anyone can create a new user
  .post('/', (req, res, next) => User.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(next))



  //a user can get themself, admins can get a user
  .get('/:id', selfOrAdmin('get'), (req, res, next) => User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(next))

  //a user can update themself, admins can update a user
  .put('/:id', selfOrAdmin('update'), (req, res, next) => {
    console.log(req.params.id, req.user.id)
    return User.findById(req.params.id)
      .then(user => user.update(req.body))
      .then(updatedUser => res.json(updatedUser))
      .catch(next)
  })

  //a user can delete themself, admins can delete a user
  .delete('/:id', selfOrAdmin('delete'), (req, res, next) => User.findById(req.params.id)
    .then(user => user.destroy())
    .then(() => res.send(202))
    .catch(next))

  //anyone can find reviews posted by the user
  .get('/:id/reviews', (req, res, next) => Review.findAll({
    where: {
      user_id: req.params.id
    }
  })
    .then(reviews => res.json(reviews))
    .catch(next))

  // a logged in user or admin can retrieve all their orders
  .get('/:id/orders', selfOrAdmin('get'),
    (req, res, next) => {
      Order.findAll({
      where: {
        user_id: +req.params.id
      },
      include: [
        {
          model: LineItem, include: [
            {
              model: Product
            },
          ]
        },
        {
          model: User
        }
      ],
      order: 'id DESC'
    })
    .then(res.send.bind(res))
    .catch(next)

    })
