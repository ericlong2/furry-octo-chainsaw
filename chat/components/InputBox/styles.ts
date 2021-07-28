import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
    container:{
        flexDirection : 'row',
        margin: 10,
        alignItems: 'flex-end',
    },

    mainContainer:{
        flexDirection : 'row',       
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        marginRight: 10,
        flex: 1,
        alignItems: 'center'
    },

    buttonContainer: {
        backgroundColor: Colors.light.tint,
        borderRadius: 50,
        width: 50, 
        height: 50,
        justifyContent: 'center',
        alignItems:'center',
    },

    textInput: {
        flex: 1, 
        marginHorizontal: 10,
        fontSize: 20,

    },

    icon:{
        marginHorizontal: 7,
    },

    containerKeyboard: {
        flex: 1,
    },

})

export default styles