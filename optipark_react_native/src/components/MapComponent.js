import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Location, Speech} from 'expo';
import { StyleSheet, View, Text, Button, ToastAndroid, Image, Dimensions} from 'react-native';
import MapView,{Marker,Polyline, Callout} from 'react-native-maps';
import {createGraph,assignSensor, getPolyline, findNodeCoord, angleBetweenPoints, getDirection, determimeDirection, findNodeIndex, distance} from '../functions/DirectFunctions';
import {getGeo, assignSpot, changeSpotStatus} from '../actions/geo';
import {signOutUser} from '../actions/login';
import avaliableMarker from '../images/avaliable.png';
import takenMarker from '../images/taken.png';
import carIcon from '../images/carIcon2.png';
import suppMarker from '../images/node.png';
import rightIcon from '../images/rightIcon.png'
import leftIcon from '../images/leftIcon.png'

const Toast = (props) => {
    if(props.visible){
        ToastAndroid.showWithGravity(
            props.message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          return null;
    }
    return null;
}

class MapComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            showDistance:false,
            currPos:{
                latitude:34.018622596382315,
                longitude:-118.49403787381576,
            },
            currAng:45,
            center:{
                latitude:34.01875798929364,
                longitude:-118.49381178617476,
            },
            direction:"straight",
        }
    }

    componentWillMount(){

        this.setState({g:createGraph(this.props.sensors, this.props.support)})
        Location.hasServicesEnabledAsync().then((enabled)=>{            
            if(!enabled)console.log("Please enable position");
            else{
                Location.getCurrentPositionAsync(Location.Accuracy.High).then((position)=>{
                    console.log(position);
                })
            }
        })

    }

    componentDidMount(){
        this.assignSensor()
    }

    componentDidUpdate(prevProps, prevState){
       if (this.state.show) {
           
           setTimeout(() => {
               this.setState({show:false})
           }, 2000);
       } 
       if (prevState.currPos!=this.state.currPos) {
            this.assignSensor();
            
       }
    }

    onRegionChange = (region) =>{
        this.setState({region:region})
    }

    logout = () => {
        this.props.signOutUser(this.props.navigation);  
    }

    getNodeCoord = (nodeName) => {
        let coord = {}
        if (nodeName.split("")[0]==="h") {
            coord = findNodeCoord(this.props.support,nodeName)
            coord = {latitude:coord[0],longitude:coord[1]}
        }
        if (nodeName.split("")[0]==="s") {
            coord = findNodeCoord(this.props.sensors,nodeName)
            coord = {latitude:coord[0],longitude:coord[1]}
        }
        return coord
    }

    assignSensor = () =>{
        const assigned = assignSensor(this.state.g,this.props.sensors,this.props.support,[this.state.currPos.latitude,this.state.currPos.longitude])
        const spot = assigned[0];
        const path  = assigned[1];
        if(spot.length===0&& path.length===0){
            Speech.speak("The parkinglot is full", {
                language:'en',
                pitch:0.9,
                rate:0.8,
            })
            ToastAndroid.showWithGravity(
                "The parking lot is full",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return null;
        }
        
        console.log(distance([this.state.currPos.latitude, this.state.currPos.longitude],findNodeCoord(this.props.sensors,spot)));
        
        if (distance([this.state.currPos.latitude, this.state.currPos.longitude],findNodeCoord(this.props.sensors,spot))<4) {
            Speech.speak("You have arrived at your destination", {
                language:'en',
                pitch:0.9,
                rate:0.8,
            })
            ToastAndroid.showWithGravity(
                "You have arrived at your destination",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            this.props.changeSpotStatus("Library", findNodeIndex(this.props.sensors,spot),1);
            this.setState({path:null, direction:null, currDistance:null, spot, totDistance:null,showDistance:false, latlngs:null})
            setTimeout(() => {
                this.props.navigation.navigate("Home")
            }, 1000);
            return null;
        }
        console.log("not");
        

        //Finding point coordinates to find angle between first->second, and second-> third
        let p1 = this.getNodeCoord(path[1][0]);
        let p2 = this.getNodeCoord(path[2][0]);
        let dir1 = getDirection(angleBetweenPoints(this.state.currPos,p1));
        let dir2 = getDirection(angleBetweenPoints(p1,p2));
        let direction = determimeDirection(dir1,dir2); 
        if (direction==="delete") {
            path.splice(1,1);
        }
        
        let dist = 0;
        for (let i = 1; i < path.length-1; i++) {
            p1 = this.getNodeCoord(path[i][0]);
            p2 = this.getNodeCoord(path[i+1][0]);
            dir1 = getDirection(angleBetweenPoints(this.state.currPos,p1));
            dir2 = getDirection(angleBetweenPoints(p1,p2));
            direction = determimeDirection(dir1,dir2); 
            dist = path[i][1];            
            if (direction==="Right"||direction==="Left") {
                break
            }
        }
        if (path.length===3) {
            Speech.speak("Take a "+direction+" in "+dist.toFixed(0)+" meters. Then you arrive at your assigned parkinglot", {
                language:'en',
                pitch:0.9,
                rate:0.8,
            })
        }else{
            Speech.speak("Take a "+direction+" in "+dist.toFixed(0)+" meters", {
                language:'en',
                pitch:0.9,
                rate:0.8,
            })
        }

        this.setState({
            path,
            spot,
            show:this.state.showDistance?false:true,
            showDistance:true,
            totDistance:path[path.length-1][1],
            currDistance:dist,
            direction,
            directionIcon:direction==="Right"?rightIcon:leftIcon,
            latlngs:getPolyline(this.state.currPos,assigned[1], this.props.sensors, this.props.support),
                    
        },
        ()=>{this.hideToast()}
        )
    }

    hideToast = () => {
        this.setState({
          show: false,
        });
      };

    pressMap = (map) => {
        const latitude = map.nativeEvent.coordinate.latitude;
        const longitude = map.nativeEvent.coordinate.longitude;        
        this.setState({currPos:{latitude, longitude}})
        
    }

    changePosition = (latOffset,lngOffset) => {
        const latitude = this.state.currPos.latitude+latOffset;
        const longitude = this.state.currPos.longitude+lngOffset;
        this.setState({ prevPos:this.state.currPos, currPos:{latitude,longitude} })
        this.updateMap();
    }

    getRotation = (prevPos, currPos) => {
        if(!prevPos)return 0;
        const xDiff = currPos.lat - prevPos.lat;
        const yDiff = currPos.lng - prevPos.lng;
        return (Math.atan(yDiff,xDiff)*180)/Math.PI;
    }

    updateMap = () => {
        const { currPos, prevPos, currAng } = this.state;
        const currRot = this.getRotation(prevPos,currPos);
        this.map.animateCamera({heading:currRot,center:currPos,pitch:currAng})
    }

    render(){
        return(
                this.props.sensors?
                <View style={styles.wrapper}>
                    <MapView
                        ref={el=>(this.map=el)}
                        style={styles.map}
                        onRegionChange={this.onRegionChange}
                        initialRegion={{
                            latitude: this.state.center.latitude,
                            longitude: this.state.center.longitude,
                            latitudeDelta: 0.000782,
                            longitudeDelta: 0.000781          
                        }}
                        showsUserLocation
                        userLocationAnnotationTitle={"UserLocation"}
                        followsUserLocation={true}
                        showsMyLocationButton={true}
                        toolbarEnabled={false}
                        loadingEnabled={true}
                        onPress={this.pressMap}
                        moveOnMarkerPress={false}
                    >
                        <Marker 
                            coordinate={{latitude:this.state.currPos.latitude,longitude:this.state.currPos.longitude}}
                            title={"Here's you"}
                            anchor={{x:0.5,y:0.5}}
                        >
                        <Image
                            source={carIcon}
                            style={{ width: 40, height: 40 }}
                        />
                        </Marker>

                        {Object.keys(this.props.sensors).map((item)=>
                            <Marker 
                                id={this.props.sensors[item].properties.name} 
                                coordinate={{
                                    latitude:this.props.sensors[item].geometry.coordinates[0],
                                    longitude:this.props.sensors[item].geometry.coordinates[1]}} 
                                anchor={{x:0.5,y:0.5}}
                            >
                            <Image
                                source={this.props.sensors[item].properties.status===0?
                                    avaliableMarker
                                    :
                                    takenMarker}
                                style={{ width: 20, height: 20 }}
                            />            
                            </Marker>
                        )}
                        {this.state.path&&this.state.latlngs?
                            Object.keys(this.state.path).map((item)=>{
                                let coord = []
                                
                                if (this.state.path[item][0].split("")[0]==="h") {
                                    coord = findNodeCoord(this.props.support,this.state.path[item][0])
                                    
                                    return(
                                    <Marker 
                                        id={this.props.support[item].properties.name} 
                                        coordinate={{
                                            latitude:coord[0],
                                            longitude:coord[1]}}
                                        anchor={{x:0.5,y:0.5}}  
                                        >
                                        <Image
                                            source={suppMarker}
                                            style={{ width: 10, height: 10 }}
                                        />
                                        
                                    </Marker>)
                                }
                                
                                
                            }
                        )
                            :null}
                        {this.state.path&&this.state.latlngs?
                        <Polyline
                            coordinates={this.state.latlngs}
                            strokeWidth={6}
                            strokeColor='blue'
                        />
                        :null}
                    </MapView>
                    {this.state.showDistance&&this.state.currDistance&&this.state.totDistance?
                        <View style={styles.directionStyle}>
                            <Image
                                source={this.state.directionIcon}
                                style={styles.arrow}
                            />
                            <Text style={styles.meter}>in {this.state.currDistance.toFixed(0)} meter</Text>
                            <Text style={styles.goal}>Distance to goal: {this.state.totDistance.toFixed(0)}m</Text>  
                        </View>
                    :null}

                    <View style={styles.assignBtn}>
                        <Button title="assign" onPress={this.assignSensor}></Button>
                    </View>
                    <View style={styles.logoutBtn}>
                        <Button onPress={this.logout} title="Log out"/> 
                    </View>
                    <Toast visible={this.state.show} message={'Spot assigned'}/>

                    
                </View>
                
                :null
            
        );
    }
}

const mapStateToProps = (state) => {
    const {login, sensors, support, entrance, corners} = state.database;    
    const {path, sensor} = state.global
    
    return{
        login,
        sensors,
        support,
        entrance,
        corners,
        path,
        sensor
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({getGeo, assignSpot, signOutUser, changeSpotStatus}, dispatch);
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);

const styles = StyleSheet.create({
map:{
    height:'100%',
    alignSelf:'stretch',
},
assignBtn:{
    position:'absolute',
    top:'90%',
    right:'1%',
},
directionStyle:{
    position:'absolute',
    top:'70%',
    left:'20%',
    width:'60%',
    height:'20%',
    justifyContent: 'center',
    alignItems: 'center',
},
arrow:{
    width:'52%',
    height:'55%',
},
goal:{
    
},
meter:{
    fontWeight:'bold',
    fontSize: 20,
},
logoutBtn:{
    position:'absolute',
    top:'90%',
    left:'1%',
}
});