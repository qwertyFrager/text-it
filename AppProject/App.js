import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// import ClassHome from './components/ClassHome';
import Results from './components/Results'
import Home from './components/Home';
import Create from './components/Create'
import Details from './components/Details'
import Edit from './components/Edit'
import Login from './components/Login'
import Registration from './components/Registration'

import Contants from 'expo-constants';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

function App() {

  return (
    <View style={styles.container}>           
      <Stack.Navigator>
      <Stack.Screen name = "Registration" component = {Registration}/> 
        <Stack.Screen name = "Login" component = {Login}/> 
        <Stack.Screen name = "Home" component = {Home}/>        
        <Stack.Screen name = "Results" component = {Results}/>           
        <Stack.Screen name = "Create" component = {Create}/>     
        <Stack.Screen name = "Details" component = {Details}/>    
        <Stack.Screen name = "Edit" component = {Edit}/>         
      </Stack.Navigator>      
      
      <StatusBar style="auto"/>
    </View>
  );
}

export default()=>{
  return(
    <NavigationContainer>
      <App/>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eddfdf',
    marginTop: Contants.statusBarHeight
  }
});
