import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView
} from 'react-native';
//Redux
//Colors
import Colors from '../../utils/Colors';
//Animation
import Animated from 'react-native-reanimated';
//Components
import { Header } from './components/Header'

// Float Button
import { Portal, Provider } from 'react-native-paper';

//

import SkeletonLoading from '../../components/Loaders/SkeletonLoading'
import SnackBar from '../../components/Notification/SnackBar'
import Carousel from './components/Carousel/Carousel'

import { CategorySection } from './components/Categories'


import { FloatButton } from './components/Contact'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)


import banners from "../../db/Banners";

import { IUser, IProduct, ICategory } from '@types';
import { fetchCategories } from '../../actions/category';
import { fetchProducts } from '../../actions/product';
import { connect, ConnectedProps } from 'react-redux';


interface IHomeProps {
  navigation: any,
}
interface IHomeState {
}
interface IMapDispatchToProps {
  fetchCategories: () => void,
  fetchProducts: () =>void
}

interface IMapStateToProps {
  isLoading: boolean,
  notification: any,
  user: IUser | null,
  products: IProduct[] | [],
  categories: ICategory[] | [],
}

function mapDispatchToProps(dispatch : any ) : IMapDispatchToProps{
  return {
    fetchCategories : () => dispatch(fetchCategories()),
    fetchProducts: () => dispatch(fetchProducts())
  }
}

function mapStateToProps(state : any) : IMapStateToProps{
  return {
    products: state.store.products,
    categories: state.category.categories,
    isLoading : state.store.isLoading,
    notification: state.auth.notification,
    user:state.auth.user
  }
}


const connector = connect(mapStateToProps,mapDispatchToProps);

type TStateProps = ReturnType<typeof mapStateToProps>
type TDispatchProps = ReturnType<typeof mapDispatchToProps>
type TPropsRedux = ConnectedProps<typeof connector>
type IComposeHomeProps = TDispatchProps & TStateProps & TPropsRedux & IHomeProps
class HomeClass extends React.Component<IComposeHomeProps, IHomeState> {
  constructor(props: IComposeHomeProps) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchCategories()
    this.props.fetchProducts()
  }

  render() {
    let scrollY =  new Animated.Value(0);
    return (
      <Provider>
        {
          this.props.isLoading
            ? (< SkeletonLoading />)
            : (
              <SafeAreaView style={styles.container}>
                <Header
                  products={this.props.products}
                  navigation={this.props.navigation}
                />
                <Portal>
                  <FloatButton />
                </Portal>
                <AnimatedFlatList
                  contentContainerStyle={styles.list}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={() => (
                    <View style={styles.banner}>
                      <Carousel banners={banners} />
                    </View>
                  )}
                  scrollEventThrottle={1}
                  onScroll={Animated.event(
                    [
                      {
                        nativeEvent: { contentOffset: { y: scrollY } },
                      },
                    ],
                    { useNativeDriver: true },
                  )}
                  data={this.props.categories}
                  keyExtractor={(item: ICategory) => item.code}
                  renderItem={({ item }: any) => (
                    <CategorySection
                      category={item}
                      listProducts={this.props.products}
                      navigation={this.props.navigation}
                    />
                  )}
                />
                {Object.keys(this.props.notification).length === 0 ? (
                  <View />
                ) : (
                  <SnackBar
                    checkVisible={true}
                    message={
                        Object.keys(this.props.user as any).length ===0  
                        ? this.props.notification
                        : this.props.notification + ' ' + this.props.user!.name
                    }
                  />
                )}
              </SafeAreaView>
            )}
      </Provider>

    )
  }
}



export default connector(HomeClass)




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  list: {
    width: '100%',
    marginTop: 50,
    paddingBottom: 20,
  },
  banner: {
    marginBottom: 50
  }
});
