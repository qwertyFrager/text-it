import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'

class ClassHome extends Component {

    state = {
        name: "Puhi4"
    }

    render(){
        return(
            <View>
                <Text>Hello From ClassHome yoo</Text>
                <Text>{this.state.name}</Text>
                <Button title="Click Me!!!" onPress={()=>this.setState({name: "changed name"})}/>
            </View>
        )
    }
}

export default ClassHome