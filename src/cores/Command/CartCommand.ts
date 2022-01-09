import { Alert } from "react-native";
import { addToCart } from "../../actions/cart/cartActions";
import { ICommand } from "./ICommand";

export class CartCommand implements ICommand {
    public item: any;
    public dispatch: any;

    constructor(item: any, dispatch: any) {
        this.item = item;
        this.dispatch = dispatch;
    }

    async excute()  {
        try {
            await this.dispatch(addToCart(this.item));
            Alert.alert("Thêm thành công", "Sản phẩm đã được thêm vào giỏ hàng", [
                {
                    text: "OK",
                },
            ]);

        } catch (err) {
            throw err;
        }
    }

}