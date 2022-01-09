import { Alert } from "react-native";
import { removeFavorite } from "../../actions/favorite/favoriteActions";
import { ICommand } from "./ICommand";

export class FavoriteCommand implements ICommand {
    public item: any;
    public dispatch: any;

    constructor(item: any, dispatch: any) {
        this.item = item;
        this.dispatch = dispatch;
    }

    async excute() {
        Alert.alert(
            "Bỏ yêu thích",
            "Bạn có muốn bỏ sản phẩm ra khỏi mục yêu thích?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Đồng ý",
                    onPress: async () => await this.dispatch(removeFavorite(this.item._id)),
                },
            ]
        );
    }

}