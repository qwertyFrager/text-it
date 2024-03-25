import React, {useState, useEffect} from 'react'
import {View, Text, Button, FlatList, StyleSheet} from 'react-native'
import {Card, FAB} from 'react-native-paper'

function Results(props){

    const [myData, setData] = useState([]) //Использование хуков

    // Потянуть вниз для обновления информации pull-to-refresh
    const [loading, setIsLoading] = useState(true)
    const loadData = () =>{
        fetch(
            'http://192.168.3.2:3000/getaudios',
            //'https://text-it-backend-production.up.railway.app/getaudios',
            {method:'GET'}
        )            
        .then(resp => resp.json())
        .then(audio => {
            setData(audio)
            setIsLoading(false)
        })
        .catch(error => console.log(error))
    }

    //Берем данные с бэкенда (уже через функцию выше)
    useEffect(()=>{
        loadData()
    }, [])    


    const clickedItem = (data) => {
        props.navigation.navigate('Details', {data:data})
    }


    const renderData = (item) => {
        return(
            <Card style = {styles.cardStyle} onPress={()=>clickedItem(item)}>
                <Text style = {{fontSize: 20, fontWeight: 600}}>
                    ID: {item.id}
                </Text>

            </Card>
        )
    }

    
    return(
    <View style={{flex:1}}>
        <FlatList
            data={myData}
            renderItem={({item})=>{
                return renderData(item)
            }}
            onRefresh = {()=>loadData()}
            refreshing = {loading}
            keyExtractor={item => `${item.id}`} 
        />      

        {/*
        <FAB
            style = {styles.fab}
            small = {false}
            icon = "plus"
            theme = {{colors:{accent:"green"}}}
            onPress = {() => props.navigation.navigate('Create')}
        />  
        */}
    </View>
    )
}

const styles = StyleSheet.create({
    cardStyle:{
        margin: 10,
        padding: 10,
    },

    fab:{
        position:'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }
})

export default Results