import { IUser } from "../../@types";


interface ICartService {
  load() : any,
  block() : any
}


class CartService implements ICartService {
  block() {
    return false;
  }
  load(){
    return true;
  }
}

class CartProxy implements ICartService {
  private user : IUser;
  private cart : CartService;

  constructor(user : IUser){
    this.user = user;
    this.cart = new CartService()
  }

  block() {
    throw new Error("Method not implemented in Proxy.");
  }
  load() {
    if(!this.isAccess()){
      this.cart.block()
    } else {
      this.cart.load();
    }
  }
  
  private isAccess() : boolean{
    return this.user.token ? true : false
  } 
} 

export default CartProxy;