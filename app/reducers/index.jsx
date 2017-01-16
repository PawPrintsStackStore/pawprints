import { combineReducers } from 'redux'

import authReducer from './auth'
import reviewsReducer from './reviews'
import ordersReducer from './orders'
import productsReducer from './products'
import usersReducer from './users'


const rootReducer = combineReducers({
  auth: authReducer
// reviewsReducer,
ordersReducer,
productsReducer,
// usersReducer,

})

export default rootReducer
