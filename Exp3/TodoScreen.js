import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TodoScreen({ route }) {
  const { name } = route.params;
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
    setTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(item => item.id !== id));
  };

  const renderItem = ({ item }) => (
  <View style={styles.taskItem}>
    <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.checkbox}>
      <Ionicons
        name={item.completed ? 'checkbox' : 'square-outline'}
        size={26}
        color={item.completed ? '#EFA4B8' : '#999'}
      />
    </TouchableOpacity>

    <View style={styles.taskContent}>
      <Text style={[styles.taskText, item.completed && styles.taskDone]}>
        {item.text}
      </Text>
    </View>

    <TouchableOpacity onPress={() => deleteTask(item.id)}>
      <Text style={styles.deleteText}>❌</Text>
    </TouchableOpacity>
  </View>
);


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
  <Text style={styles.title}>🍓 {name}'s To Do List</Text>

  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      placeholder="Task to be completed"
      onChangeText={setTask}
      value={task}
    />
    <TouchableOpacity style={styles.addButton} onPress={addTask}>
      <Text style={styles.addText}>➕</Text>
    </TouchableOpacity>
  </View>

  <View
    style={{
      height: 1,
      backgroundColor: '#e0a9b4',
      marginLeft: -20,
      marginRight: -20,
    }}
  />
   <View
    style={{
      height: 1,
      backgroundColor: '#e0a9b4',
      marginLeft: -20,
      marginRight: -20,
      marginTop:2,
    }}
  />
</View>

        {/* Task list with background line */}
        <View style={styles.taskListWrapper}>
          {/* The vertical background line */}
          <View style={styles.verticalLine} />
          <View style={[styles.verticalLine, { left: 57 }]} />
          <View style={{ flex: 1 }}>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#B43E6A',
    marginBottom: 40,
    fontFamily: 'Cochin',
    textAlign: 'center',
  },
  headerWrapper: {
  backgroundColor: '#FFF0F5', // light grey
  paddingHorizontal: 20,
  paddingTop: 80,
},

  inputWrapper: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
    marginLeft: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F4C2C2',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal:20,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 20,
    marginRight: 15,
    backgroundColor: '#FADADD',
    borderRadius: 50,
    padding: 0,
  },
  addText: {
    fontSize:30,
  },
taskListWrapper: {
  flex: 1,
  position: 'relative', // this is crucial
  paddingLeft: 0,
  justifyContent: 'flex-start',
  paddingBottom: 60,
},
verticalLine: {
  position: 'absolute',
  top:1,
  left:60,
  bottom: 0,
  width: 1,
  backgroundColor: '#ECB3C4', 
  zIndex: 0, 
},
  listContent: {
    paddingBottom: 20,
  },
taskItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingRight: 40,
  paddingLeft: 20,
  marginBottom: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#ffe6e6ff', 
  marginHorizontal: -20, 

},

  checkbox: {
    marginRight: 40,
    marginLeft: 18,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 20,
    color: '#5B4A4A',
    fontFamily: 'Cochin',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#B5A6A6',
  },
  deleteText: {
    fontSize: 16,
    paddingLeft: 10,
    color: '#CC4C4C',
  },
  doodle: {
  fontSize: 24,
  position: 'absolute',
  bottom: 20,
  right: 20,
}


});
