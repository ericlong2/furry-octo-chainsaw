import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-between',
        padding: 10,
    },

    leftContainer: {
        flexDirection : "row",
    },

    midContainer:{
        justifyContent: "space-around"
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginHorizontal: 15,
    },

    userName:{
        fontWeight: "bold",
        fontSize: 16,
    },

    status:{
        fontSize: 15,
        color: 'grey',
        
    },

    container1: {
        flex: 1
      },


});

export default styles;