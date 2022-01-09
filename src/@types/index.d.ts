export interface IUser {
  _id: string,
  name: string,
  password: string,
  rawPassword: string,
  email: string,
  phone: string,
  address: string,
  profilePicture?: string,
  token: string,
  loginAt: number,
  expireTime: number
}

export interface IProduct {
  _id: string,
  url: string,
  thumb: string,
  stocks: number,
  filename: string,
  title: string,
  price: number,
  description: string,
  author: IAbstractPerson,
  publisher: IPublisher,
  provider: IProvider,
  category: ICategory

}

export interface IAbstractPerson {
  _id: string,
  name: string,
  createdAt: string,
  updatedAt: string
}
export interface IProvider extends IAbstractPerson {

}

export interface IPublisher extends IAbstractPerson {

}

export interface IAuthor extends IAbstractPerson {

}




export interface ICategory {
  _id: string,
  name: string,
  code: string,
  createdAt: string,
  updatedAt: string
}

export interface ISignup {
  name: string,
  email: string,
  password: string
}

export interface ILogin {
  email: string,
  password: string
}

export interface IEditInformation {
  phone: string,
  address: string,
  name: string
}

export interface IUploadProfilePicture {
  imageUri: any,
  filename: string,
  type: any
}

export interface IResetPassword {
  password: string,
  url: any
}

export interface IPromotion {
  code: string,
  createdAt: string,
  expiredAt: string,
  imageUrl: string,
  name: string,
  updatedAt: string,
  value: number,
  _id: string
}

