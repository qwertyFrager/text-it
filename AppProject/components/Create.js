import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

function Create(props) {
    
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    const insertData = () =>{
        fetch(
            'http://192.168.3.2:3000/add',
            //'https://text-it-backend-production.up.railway.app/add',
            {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title:title, body:body})
            })
            .then(resp => resp.json())
            .then(props.navigation.navigate('Home'))
            .catch(error => console.log(error))
    }

    return (
        <View>
            <TextInput style = {styles.inputStyle}
                label="Title"
                value = {title}
                mode = "outlined"
                onChangeText = {text => setTitle(text)}
            />

            <TextInput style = {{margin:10}}
                label="Description"
                value = {body}
                mode = "outlined"
                multiline
                numberOfLines = {10} 
                onChangeText = {text => setBody(text)}
            />

            <Button
                style = {{margin:10}}                
                icon = "pencil"
                mode = "contained"
                onPress = {() => insertData()}                
            >Insert Article</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    inputStyle: {        
        margin: 10,
        marginTop: 30,        
    }
})

export default Create