import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Home from '../components/Home';
import MapComponent from '../components/MapComponent';


const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
        headerLeft: null
    }
  },
    Map: {
      screen: MapComponent,
      navigationOptions: {
          headerLeft: null
      }
    },
  });

export default createAppContainer(TabNavigator);