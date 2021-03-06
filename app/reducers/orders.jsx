import {
  RECEIVE_ORDERS,
  RECEIVE_SINGLE_ORDER,
  RECEIVE_CURRENT_ORDER,
  ADD_PRODUCT_TO_ORDER,
  CHANGE_QUANTITY_OF_PRODUCT,
  REMOVE_PRODUCT_FROM_ORDER,
  CHANGE_BILLING_ADDRESS,
  CHANGE_SHIPPING_ADDRESS,
  CHECKOUT,
  RESET_CART,
} from 'APP/app/constants'

const DEFAULT_STATE = {
  allOrders: [],
  selectedOrder: {},
  currentOrder: {
    products: [],
    shippingAddress: {
      name: '',
      businessName: '',
      phone: '',
      streetNum: '',
      streetName: '',
      apartment: '',
      city: '',
      state: '',
      zip: ''
    },
    billingAddress: {
      name: '',
      businessName: '',
      phone: '',
      streetNum: '',
      streetName: '',
      apartment: '',
      city: '',
      state: '',
      zip: ''
    },
  },
}


const ordersReducer = (state = DEFAULT_STATE, action) => {

  const newState = Object.assign({}, state)

  switch(action.type) {
    case RECEIVE_ORDERS:
      newState.allOrders = action.orders
      break
    case RECEIVE_SINGLE_ORDER:
      newState.selectedOrder = action.order
      break
    case RECEIVE_CURRENT_ORDER:
      newState.currentOrder = action.order
      break
    case ADD_PRODUCT_TO_ORDER:

      let inCart = false
      newState.currentOrder.products = newState.currentOrder.products.map(product => {
        if (product.productId === action.productId) {
          product.quantity += +action.quantity
          inCart = true
        }
        return product
      })
      if (!inCart) {
        newState.currentOrder.products.push(
          {
            productId: action.productId,
            quantity: action.quantity,
            product: action.product
          })
      }
      break
    case CHANGE_QUANTITY_OF_PRODUCT:
      newState.currentOrder.products = newState.currentOrder.products.map(product => {
        if (product.productId === action.productId) {
          product.quantity = +action.quantity
        }
        return product
      })
      break
    case REMOVE_PRODUCT_FROM_ORDER:
      newState.currentOrder.products = newState.currentOrder.products.filter(product => {
        return (product.productId !== action.productId)
      })
      break
    case CHANGE_BILLING_ADDRESS:
      newState.currentOrder.billingAddress = action.billingAddress
      break
    case CHANGE_SHIPPING_ADDRESS:
      newState.currentOrder.shippingAddress = action.shippingAddress
      break

    case RESET_CART:
      newState.currentOrder = DEFAULT_STATE.currentOrder
      break

    default:
      return state
  }

  // save current order in cart
  let cart = JSON.stringify(newState.currentOrder)
  sessionStorage.setItem('cart', cart)

  return newState
}

export default ordersReducer
