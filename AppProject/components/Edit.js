import React, {useState} from 'react'
import {View, StyleSheet} from 'react-native'
import {TextInput, Button} from 'react-native-paper';

function Edit(props){

    const data = props.route.params.data;

    const [transcription, setTranscription] = useState(data.transcription)
    const [response, setResponse] = useState(data.response)

    const updateData = () =>{
        fetch(
            `http://192.168.3.2:3000/updateaudio/${data.id}/`,
            //`https://text-it-backend-production.up.railway.app/updateaudio/${data.id}/`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({transcription:transcription, response:response})
            })
            .then(resp => resp.json())
            .then(props.navigation.navigate('Home', {data:data}))
            .catch(error => console.log(error))
    }

    return(
        <View>
            <TextInput style = {styles.inputStyle}
                label="Transcription"                                
                value = {transcription}                
                mode = "outlined"
                multiline
                onChangeText = {text => setTranscription(text)}
            />

            <TextInput style = {{margin:10}}
                label="Response"
                value = {response}
                mode = "outlined"
                multiline                
                onChangeText = {text => setResponse(text)}
            />

            <Button
                style = {{margin:10}}                
                icon = "update"
                mode = "contained"
                onPress = {() => updateData()}                
            >Update Article</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    inputStyle: {        
        margin: 10,
        marginTop: 30,        
    }
})

export default Edit