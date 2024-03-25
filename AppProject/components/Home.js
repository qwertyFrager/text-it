/*
import React, {useState, useEffect} from 'react'
import {Audio} from 'expo-av';
import {View, Text, StyleSheet} from 'react-native'
import { Button } from 'react-native-paper';

function Home(){
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [message, setMessage] = React.useState("");

    async function startRecording(){
        try{
            const permission = await Audio.requestPermissionAsync();

            if(permission.status === "granted"){
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });

                const{recording} = await Audio.Recording.createAsync(
                    Auido.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );

                setRecording(recording)
            }else{
                setMessage('Please grant permission')
            }
        } catch(err){
            console.error('Failed to start recording', err)
        }
    }

    async function stopRecording(){
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        let updateRecordings = [...recordings];
        const {sound, status} = await recording.createNewLoadedSoundAsync();
        updateRecordings.push({
            sound:sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });
        
        setRecordings(updateRecordings)
    }

    function getDurationFormatted(millis){
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;

        return `${minutesDisplay}:${secondsDisplay}`;
    }

    return(
        <View>
            <Text>{message}</Text>
            <Button
                onPress={recording ? stopRecording() : startRecording()}
                mode = "contained"
            >{recording ? "Stop" : "Start"}</Button>            
        </View>        
    )
}

export default Home
*/

import { FAB} from 'react-native-paper'

import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
// import Timer from './Timer';

function Home(props) {
    const pushAudio = (url) =>{        
        const formData = new FormData();
        formData.append('file',{
            uri: url,
            type: 'audio/m4a',
            name: 'audiofile.m4a'            
        })    

        fetch(
            'http://192.168.3.2:3000/uploadaudio',
            //'https://text-it-backend-production.up.railway.app/uploadaudio',
            {
                method: 'POST',
                headers: {
                    'Content-Type':'multipart/form-data'
                },
                body: formData
            })
            .then(resp => resp.json())
            .then(props.navigation.navigate('Results'))
            .catch(error => console.log(error)
        )
    }


    const [recording, setRecording] = React.useState();

    async function startRecording() {
        try {
        console.log('Requesting permissions..');
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
        
        console.log('Starting recording...');
        startTimer(); //Функция для компонента Timer

        const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
        console.log('Recording started');
        } catch (err) {
        console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');        
        stopTimer(); //Функцияя для компонента Timer

        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        pushAudio(uri);
        console.log('Recording stopped and stored at', uri);
    }


    // Логика для компонента Timer (пока он не подключен)
    const [time, setTime] = useState(0);
    const intervalRef = useRef(null);

    const startTimer = () => {
        if (intervalRef.current !== null) return;

        intervalRef.current = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 100);
    };

    const stopTimer = () => {
        if (intervalRef.current === null) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const resetTimer = () => {
        stopTimer();
        setTime(0);
    };

    const formatTime = (time) =>{
        return `${Math.floor(time/10/60)%60} : ${Math.floor(time/10)%60} : ${time%10}`
    }
    // Конец логики для компонента Timer


    return (
        <View style={{flex:1}}>                   
            <Button                                
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
            />     

            {/*HTML для компонента Timer (пока он не подключен)*/}
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ fontSize: 32}}>{formatTime(time)}</Text>
                <View style={{ flexDirection: 'row' }}>                
                    <Button title="Reset" onPress={resetTimer} />
                </View>
            </View>
            {/* Конец HTML для компонента Timer*/}            

            <FAB      
                style = {styles.fab}      
                small = {false}
                icon = "plus"
                theme = {{colors:{accent:"green"}}}
                onPress = {() => props.navigation.navigate('Results')}
            />  
        </View>
    );
}

const styles = StyleSheet.create({    
    fab:{
        position:'absolute',
        margin: 16,
        right: 0,
        bottom: 100
    }
})

export default Home;