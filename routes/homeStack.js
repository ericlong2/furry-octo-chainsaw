import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/properties";
import RentalDetails from "../screens/rentalPage";
import Login from "../screens/LoginScreen";
import Register from "../screens/RegisterScreen";
import Start from "../screens/StartScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import Tenant from "../screens/Tenant";
import invitationPage from "../screens/testInvitationPage";
import editTenant from "../screens/editTenant";
import tenantHome from "../screens/tenantHome";

const screens = {
  // TenantForm: {
  //   screen: TenantForm,
  //   navigationOptions: {
  //     title: "TenantForm",
  //   },
  // },
  tenantHome: {
    screen: tenantHome,
    navigationOptions: {
      title: "tenantHome",
    },
  },
  editTenant: {
    screen: editTenant,
    navigationOptions: {
      title: "editTenant",
    },
  },
  invitationPage: {
    screen: invitationPage,
    navigationOptions: {
      title: "invitationPage",
    },
  },
  Tenant: {
    screen: Tenant,
    navigationOptions: {
      title: "Tenant",
    },
  },
  ResetPasswordScreen: {
    screen: ResetPasswordScreen,
    navigationOptions: {
      title: "ResetPasswordScreen",
    },
  },
  Login: {
    screen: Login,
    navigationOptions: {
      title: "Login",
    },
  },
  Register: {
    screen: Register,
    navigationOptions: {
      title: "Register",
    },
  },
  Start: {
    screen: Start,
    navigationOptions: {
      title: "Start",
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      title: "Home",
    },
  },
  RentalDetails: {
    screen: RentalDetails,
    navigationOptions: {
      title: "Rental Page",
    },
  },
};

const HomeStack = createStackNavigator(screens, {
  initialRouteName: "Start",
  defaultNavigationOptions: {
    headerTintColor: "#444",
    headerStyle: {
      backgroundColor: "#eee",
      height: 60,
    },
  },
});

export default createAppContainer(HomeStack);
