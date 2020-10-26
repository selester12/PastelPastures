import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Header } from "react-native-elements";
import { ListItem, Avatar } from "react-native-elements";
import { AsyncStorage } from "react-native";
import Storage from "../storage/Storage";
import { Alert } from "react-native";


interface Props {
  navigation: any
}


function MatchingName(name:string) {
  return((element:any) => element.name === name);
}


class ManageGoalsScreen extends React.Component<Props>{
  state = {goals: Array<{name: string, BP: number, complete: boolean}>()};

  constructor(props:any){
    super(props);
    this.RetrieveGoals();
  }

  SetDefaultGoals(){
    const array = [
      {name: 'Take a walk', BP: 10, completed: false},
      {name: 'Take a shower', BP: 5, completed: false},
      {name: 'Do an exercise routine', BP: 15, completed: false},
      {name: 'Read for an hour', BP: 10, completed: false}
    ];
    (async() =>{
      console.log("started async");
      try{
        console.log('trying');
        await AsyncStorage.setItem('goals', JSON.stringify(array))
        this.setState({goals: array});
      } catch(error){
        console.log(error)
      }
    })();
  }
  
  RetrieveGoals(){
    var goalsArray: Array<object> = [];
    (async() =>{
      try{
        var goalsArrayString = await AsyncStorage.getItem('goals');
        if (goalsArrayString !== null && goalsArrayString !== undefined){
          goalsArray = JSON.parse(goalsArrayString);
          this.setState({goals: goalsArray});
        }
        else (this.SetDefaultGoals())
      }catch(error){console.log(error)};
    })();
  }

  AddToUserGoals(name: string){
    console.log("wow");
    var goalIndex = this.state.goals.findIndex(MatchingName(name));
    var array = this.state.goals;
    var goal = array.splice(goalIndex, 1);
    this.setState({goals: array});
    console.log(goal + 'this is the splice');
    (async() =>{
      try{
        await AsyncStorage.setItem('goals', JSON.stringify(array));
        var userGoalsArrayString = await AsyncStorage.getItem('userGoals');
        if(userGoalsArrayString !== null){
          var userGoalsArray = JSON.parse(userGoalsArrayString);
          userGoalsArray.push(goal);
          userGoalsArrayString = JSON.stringify(userGoalsArray);
          await AsyncStorage.setItem('userGoals', userGoalsArrayString);
          const newArray = await AsyncStorage.getItem('userGoals');
          console.log(newArray);
        }
      } catch(error){
        console.log(error)
      }
    })();
    console.log(this.state.goals);
  }


  render(){
    return(
    <View style={styles.container}>
      <Header containerStyle={styles.header}
        leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: (() => {
          this.props.navigation.navigate('HomeScreen')
        })}}
        centerComponent={{ text: 'Add Goals', style: { color: '#fff' } }}
        ></Header>
        <View style = {styles.list}>{
        this.state.goals.map((l, i) => (
          <ListItem key={i} bottomDivider containerStyle = {styles.listItem}>
          <ListItem.Content >
            <ListItem.Title style={{color: "white"}}>{l.name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron onPress = {() => {
            this.AddToUserGoals(l.name);
          }} style = {styles.rightIcon} iconProps = {{name:"add", size:21}}/>
          </ListItem>
        ))
      }
      </View>
      <View style = {styles.separator} lightColor = "#eee" darkColor = "rgba(255,255,255,0.1)"/>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/ManageGoalsScene.js" />
    </View>
    );
  }
}

export default ManageGoalsScreen;

const styles = StyleSheet.create({
    container: {
        //alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: 'serif'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    list: {
        backgroundColor: "black",
    },
    rightIcon: {
        alignSelf: "flex-end",
    },
    header: {
        color: "black",
        backgroundColor: "#609433",
    },
    listTitle1: {
        padding: 13,
        fontSize: 12,
        alignSelf: "center",
    },
    listItem: {
        backgroundColor: "#000",
    },
});
