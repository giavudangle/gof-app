
export interface IPromotionStrategy {
  apply(base: number,discount : number) : any
}

export class PromotionStrategy implements IPromotionStrategy {
  apply(base : number,discount: number) {
    return base - discount;
  }
  constructor(){
  }
}

export class BaseStrategy implements IPromotionStrategy {
  apply(base: number) {
    return base;
  }
  constructor(){
  }
}

export class ApplyPromotionStrategy {
  public strategy : IPromotionStrategy
  constructor(strategy : IPromotionStrategy){
    this.strategy = strategy
  }

  getFinalTotal(total : number,discount : number){
    return this.strategy.apply(total,discount)
  }

}