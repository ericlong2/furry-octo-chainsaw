import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/properties";
import RentalDetails from "../screens/rentalPage";
import AddRental from "../screens/AddForm";

const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      title: "Home",
    },
  },
  // RentalDetails: {
  //   screen: RentalDetails,
  //   navigationOptions: {
  //     title: "Rental Page",
  //   },
  // },
};

const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: "#444",
    headerStyle: {
      backgroundColor: "#eee",
      height: 60,
    },
  },
});

export default createAppContainer(HomeStack);
