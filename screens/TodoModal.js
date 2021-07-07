{/* component */ }
import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import colors from './Colors'
import { Swipeable } from 'react-native-gesture-handler'
import { createSubtask } from '../src/graphql/mutations'
import { API, graphqlOperation } from 'aws-amplify'
{/*https://www.npmjs.com/package/react-native-swipe-list-view*/}



import {getSubtask} from "../src/graphql/queries";
import {deleteSubtask,updateSubtask} from "../src/graphql/mutations";

export default class TodoModal extends Component {
    state = {
        newTodo: ""
    };
    
    toggleTodoCompleted = async(index) =>{
        console.log("toggling",index);
        let list = this.props.list;
        list.subtasks[index].inprogress = !list.subtasks[index].inprogress;

        this.props.updateList(list);
        try {
            const subtaskData = await API.graphql({
                query: getSubtask,
                variables: { id: list.subtasks[index].id},
            });

            console.log(subtaskData);
            subtaskData.data.getSubtask.inprogress = !subtaskData.data.getSubtask.inprogress;

            delete subtaskData.data.getSubtask.createdAt;
            delete subtaskData.data.getSubtask.updatedAt;

            const tmp = await API.graphql(
                graphqlOperation(updateSubtask, { input: subtaskData.data.getSubtask })
            );

        } catch (error) {
            console.log("error toggling todo",error);
        }
    };

    generateID = () => {
        return Math.random().toString();
    }

    addTodo = async() => {
        let list = this.props.list;

        if(!list.subtasks.some(todo => todo.title === this.state.newTodo)){
            const subtask = { title: this.state.newTodo, inprogress: false, id: this.generateID() };
            try {
                const subtaskData = await API.graphql(
                    graphqlOperation(createSubtask, { input: subtask })
                  );
            } catch (error) {
                console.log("error adding subtask", error);
            }

            list.subtasks.push(subtask);
            
            this.props.updateList(list);
        }


        this.setState({newTodo: ""})

        Keyboard.dismiss();
    };

    deleteTodo = async(index) => {
        let list = this.props.list;
        try {
            const subtaskData = await API.graphql(
                graphqlOperation(deleteSubtask, { input: list.subtasks[index]})
            );
        } catch (error) {
            console.log("error deleting subtask", error);
        }

        list.subtasks.splice(index,1);
        
        this.props.updateList(list);
    }
    
    renderTodo = (todo,index) => {
        return(
            <Swipeable renderRightActions={(_,dragX) => this.rightActions(dragX, index)}>
                <View style={styles.todoContainer}>
                    <TouchableOpacity onPress = {()=> this.toggleTodoCompleted(index)}>
                        <Ionicons 
                            name={todo.inprogress? "ios-square" : "ios-square-outline" }
                        size = {24} 
                        color={colors.gray} 
                        style={{width: 32}}
                    />
                    </TouchableOpacity>

                    <Text
                    style= {[styles.todo,
                    {
                        textDecorationLine: todo.inprogress ? "line-through": "none",
                        color: todo.inprogress ? colors.grey : colors.black
                    }
                    ]}
                    >
                        {todo.title}
                    </Text>
                </View>
            </Swipeable>
        );
    };

    rightActions = (dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100,0],
            outputRange: [1,0.9],
            extrapolate: "clamp"
        })

        const opacity = dragX.interpolate({
            inputRange: [-100,-20,0],
            outputRange: [1,0.9,0],
            extrapolate: "clamp"
        })

        return (
            <TouchableOpacity onPress={()=> this.deleteTodo(index)}>
                <Animated.View style={[styles.deleteButton,{opacity: opacity}]}>
                    <Animated.Text style={{color: colors.white, fontWeight: "800", transform:[{scale}]}}>
                        Delete
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    render() {
        const list = this.props.list

        const taskCount = list.subtasks.length
        const completedCount = list.subtasks.filter(todo => todo.inprogress).length

        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior = "height">
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity 
                    style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }} 
                    onPress={() => this.props.closeModel()}
                    >
                        <AntDesign name = "close" size = {24} color = {colors.black} />
                    </TouchableOpacity>

                    <View style={[styles.container, styles.header, {borderBottomColor: list.color}]}>
                        <View>
                            <Text style= {styles.title}>{list.name}</Text>
                            <Text style= {styles.taskCount}>
                                {completedCount} of {taskCount} tasks
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.section, {flex: 3, marginVertical: 16}]}>
                        <FlatList 
                        data ={list.subtasks} 
                        renderItem={({item, index}) => this.renderTodo(item, index)} 
                        keyExtractor={item=>item.title}
                        showsVerticalScrollIndicator = {false}
                        />
                    </View>

                <View style={[styles.section,styles.footer]}>
                    <TextInput 
                    style={[styles.input,{borderColor: list.color}]} 
                    onChangeText= {text => this.setState({newTodo: text})}
                    value={this.state.newTodo}
                    />
                    <TouchableOpacity style={[styles.addTodo, {backgroundColor: list.color}]} onPress={()=>this.addTodo()}>
                        <AntDesign name = "plus" size = {16} color = {colors.white} />
                    </TouchableOpacity>
                </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    section: {
        alignSelf: "stretch",
    },
    header: {
        justifyContent: "flex-end",
        width: 350,
        borderBottomWidth: 4,
        paddingTop: 16
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        marginRight: 200,
        color: colors.black,
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.grey,
        fontWeight: "600"
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 32

    },
    todo: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 16
    },
    deleteButton: {
        flex: 1.5,
        backgroundColor: colors.red,
        justifyContent: "center",
        alignItems: "center",
        width: 80,
    }

});