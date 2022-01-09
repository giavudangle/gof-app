import Cart from "../Model/Cart/Cart";
import CartItem from "../Model/Cart/CartItem";

interface IIterator<T> {
  hasNext() : boolean,
  next() : T
}


class CartIterator implements IIterator<CartItem>{
  private listItems : Array<CartItem & Cart>
  private currentIndex : number = 0
   constructor(data : any){
    this.listItems = data
  }

  hasNext(): boolean {
    return this.currentIndex < this.listItems.length
  }
  next(): CartItem & Cart {
    return this.listItems[this.currentIndex++];
  }

}

export default CartIterator