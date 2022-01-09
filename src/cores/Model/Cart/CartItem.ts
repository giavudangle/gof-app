class CartItem {
  _id: string;
  author: string;
  category: string;
  createdAt: string;
  description: string;
  filename: string;
  price: number;
  provider: string;
  publisher: string;
  stocks: number;
  thumb: string;
  title: string;
  updatedAt: string;
  url: string;
  constructor(_id : string, author : string, category : string, createdAt : string, description : string,filename: string,price:number,provider: string,publisher : string,stocks : number,thumb : string,title:string,updatedAt: string,url:string) {
    this._id =_id,
    this.author = author,
    this.category = category,
    this.createdAt = createdAt,
    this.description = description,
    this.filename= filename,
    this.price= price,
    this.provider= provider,
    this.publisher = publisher,
    this.stocks = stocks,
    this.thumb = thumb,
    this.title= title,
    this.updatedAt= updatedAt,
    this.url= url
  }
}

export default CartItem;
