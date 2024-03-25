import React from 'react'
import {View, Text, ScrollView} from 'react-native'
import {Button} from 'react-native-paper';

function Details(props){

    const data = props.route.params.data;

    const deleteData = (data) =>{
        fetch(
            `http://192.168.3.2:3000/deleteaudio/${data.id}/`,
            //`https://text-it-backend-production.up.railway.app/deleteaudio/${data.id}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json'
                },                
            })
            .then(resp => resp.json())
            .then(props.navigation.navigate('Results'))
            .catch(error => console.log(error))
    }

    async function runScript(data){          
        fetch(
            `http://192.168.3.2:3000/runscript/${data.id}/`,
            //`https://text-it-backend-production.up.railway.app/runscript/${data.id}/`,
            {                
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify('')
            }
        )
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }

    return(
        <ScrollView>
            <View>                
                <Text style={{fontSize: 20, fontWeight: 600}}>
                    TRANSCRIPTION                               
                </Text>

                <Text>
                    {'\n'} 
                    {data.transcription}
                </Text>

                <Text style={{fontSize: 20, fontWeight: 600}}>                    
                    {'\n'} 
                    RESPONSE                                        
                </Text>

                <Text style={{color: 'green'}}>  
                    {'\n'}                                       
                    {data.response}
                    {'\n'}
                </Text>

                <Button
                    style = {{marginTop:10}}                
                    icon = "update"
                    mode = "contained"
                    onPress = {() => runScript(data)}                
                >Regenerate response</Button>                

                <Button    
                    style = {{marginTop:5}}                                            
                    icon = "refresh"
                    mode = "contained"
                    onPress = {() => props.navigation.navigate('Edit', {data:data})}                
                >Edit</Button>

                <Button    
                    style = {{marginTop:5}}                            
                    icon = "delete"
                    mode = "contained"
                    onPress = {() => deleteData(data)}                
                >Delete</Button>
            </View>
            
        </ScrollView>
    )
}

export default Details