import { nextTick } from 'async';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal} from 'react-native';
import TodoModal from './TodoModal';
{/* component */ }

export default class TicketList extends React.Component{

    state = {
        showListVisible: false
    }

    toggleListModal() {
        this.setState({showListVisible: !this.state.showListVisible});
    }

    render()  {
        const list = this.props.list

        const inprogressCount = list.todos.filter(todo => todo.inprogress).length;
        const remainingCount = list.todos.length - inprogressCount;

        return (
            <View>
                <Modal 
                animationType = "slide" 
                visible ={this.state.showListVisible} 
                onRequestClose={()=> this.toggleListModal()}
                >
                    <TodoModal 
                    closeModel= {() => this.toggleListModal()}  list={list}
                    updateList={this.props.updateList}
                    />

                </Modal>
                <TouchableOpacity 
                style={[styles.listContainer, { backgroundColor: list.color }]} 
                onPress={() => this.toggleListModal()}
                    onLongPress={() => this.props.deleteList(list)}
                >
                    <Text style={styles.listTitle} numberOfLines={1}>
                        {list.name}
                    </Text>

                    <View style={{ alignItems: "center" }}>
                        {/* replace for description here?*/}
                        <Text style={styles.count}>{remainingCount}</Text>
                        <Text style={styles.subtitle}>Remaining</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        {/* replace for description here?*/}
                        <Text style={styles.count}>{inprogressCount}</Text>
                        <Text style={styles.subtitle}>In Progress</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 12,
        alignItems: "center",
        width: 200
    },
    listTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 18
    },
    count: {
        fontSize: 48,
        fontWeight: "200",
        color: colors.white
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.white
    }
})