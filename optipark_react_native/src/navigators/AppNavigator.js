import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from '../components/LoginScreen';
import RegisterScreen from '../components/RegisterScreen';
import SplashScreen from '../components/SplashScreen';
import WelcomeScreen from '../components/WelcomeScreen';
import TabNavigator from './TabNavigator';

const MainNavigator = createStackNavigator({
    SplashScreen: {
        screen: SplashScreen,
        navigationOptions: {
            headerLeft: null
        }
    },
    TabNavigator: {
        screen: TabNavigator,
        navigationOptions: {
            headerLeft: null
        }

    },
    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: {
            headerLeft: null
        }
    },
    RegisterScreen: {
        screen: RegisterScreen,
        navigationOptions: {
            headerLeft: null
        }
    },
    WelcomeScreen: {
        screen: WelcomeScreen,
        navigationOptions: {
            headerLeft: null
        }
    },

},
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;