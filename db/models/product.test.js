const {expect} = require('chai')
const db = require('APP/db')
const Product = require('./product')


//Validations have to be put inside routes

describe('Product', () => {
  before('wait for the db', () => db.didSync)

  describe('authenticates', () => {

    var product;
    beforeEach(() => {
      product = Product.build({
        title: 'A testing product',
        description: 'a very cool product',
        price: 2.50,
        inventory: 3,
      })
    })

    it('has the correct title (sanity check)', () => {
      expect(product.title).to.be.equal('A testing product')
    })


    it('rejects a null title', () => {
      product.title = null;
      return product.save()
        .then(result => {
          throw new Error('Accepted incorrect input')
        },
          err => expect(err.message).to.be.equal('notNull Violation: title cannot be null')
      );
    });

    it('rejects an empty title', () => {
      product.title = '';
      return product.save()
        .then(result => {
          throw new Error('Accepted incorrect input')
        },
          err => expect(err.message).to.be.equal('Validation error: Validation notEmpty failed')
      );
    });

    it('rejects a null price', () => {
      product.price = null;
      return product.save()
        .then(result => {
          throw new Error('Accepted incorrect input')
        },
          err => expect(err.message).to.be.equal('notNull Violation: price cannot be null')
      );
    });

    it('rejects a null description', () => {
      product.description = null;
      return product.save()
        .then(result => {
          throw new Error('Accepted incorrect input')
        },
          err => expect(err.message).to.be.equal('notNull Violation: description cannot be null')
      );
    });

    it('rejects an empty description', () => {
      product.description = '';
      return product.save()
        .then(result => {
          throw new Error('Accepted incorrect input')
        },
          err => expect(err.message).to.be.equal('Validation error: Validation notEmpty failed')
      );
    });

    it('rejects a null inventory level', () => {
      product.inventory = null;
      return product.save()
        .then(result => {
          throw new Error('Accepted incorrect input')
        },
          err => expect(err.message).to.be.equal('notNull Violation: inventory cannot be null')
      );
    });

    it('has a default image', () => product.save()
      .then(result => {
        expect(result.imgUrl).to.be.ok
      })
    )

  }),

  describe('hasMany relationship', () => {
    var option1, option2, option3, testId
    beforeEach(() => {
      option1 = Product.build({
        title: 'A testing product',
        description: 'a very cool product',
        price: 2.50,
        inventory: 3,
        category: ['cat'],
      })
      option2 = Product.build({
        title: 'The first option',
        description: 'a very cool product',
        price: 2.50,
        inventory: 4,
        category: ['cat'],
      })
      option3 = Product.build({
        title: 'The second option',
        description: 'a very cool product',
        price: 2.50,
        inventory: 1,
        category: ['cat'],
      })

      // instances must be saved to add associations
      return Promise.all([option1.save(), option2.save(), option3.save()])
        .then(values => {
          testId = values[0].id
          return values[0].setOptions([option2, option3])
        })

    })

    it('has correct options associations', () => {

      Product.findById(testId, {
        include: [{
          all: true
        }]
      })
        .then(result => {
          expect(result.options).to.have.length(2)
        })
      
    })

  })


})
