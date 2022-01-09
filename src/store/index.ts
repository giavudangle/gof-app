
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, combineReducers, applyMiddleware, Action } from "redux";
import { reducer as formReducer } from "redux-form";
import ReduxThunk, { ThunkDispatch } from "redux-thunk";

//Reducer
import {
  authReducer,
  cartReducer,
  favoriteReducer,
  orderReducer,
  productReducer,
  categoryReducer
} from "../reducers";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const rootReducer = combineReducers({
  store: productReducer,
  cart: cartReducer,
  order: orderReducer,
  auth: authReducer,
  fav: favoriteReducer,
  category: categoryReducer,
  form: formReducer,
});


const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type ThunkDispatchType = ThunkDispatch<RootState, any, Action>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
