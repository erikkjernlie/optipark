import Graph from './Graph'

export const latlngDist = (from, to) => {
    return Math.sqrt(Math.pow(from[0]-to[0],2)+Math.pow(from[1]-to[1],2))
}

export const distance = (from, to) =>{    
    let nfrom = [from[0]*Math.PI/180, from[1]*Math.PI/180];
    let nto  = [to[0]*Math.PI/180,to[1]*Math.PI/180];

    let r = 6371*1000;
    let x1 = r*Math.cos(nfrom[0])*Math.cos(nfrom[1]);
    let x2 = r*Math.cos(nto[0])*Math.cos(nto[1]);
    let y1 = r*Math.cos(nfrom[0])*Math.sin(nfrom[1]);
    let y2 = r*Math.cos(nto[0])*Math.sin(nto[1]);
    let z1 = r*Math.sin(nfrom[0]);
    let z2 = r*Math.sin(nto[0]);
    
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)+Math.pow(z1-z2,2));
}

const lowestCostNode = (costs,processed) => {
    return Object.keys(costs).reduce((lowest, node)=>{
        
        if (lowest===null||costs[node].len < costs[lowest].len) {
            if(!processed.includes(node)){
                lowest = node;
            }
        }
        return lowest;
    },null);
}


export const dijkstra = (g, start, finish) => {
    
    let start_node = g.adjList.get(start);
    let costs = Object.assign({[finish]:{len:Math.pow(10,1000)}},start_node);
    let parents = {[finish]:null};
    
    for (let child in start_node) {
        parents[child] = start
    }
    
    let processed = [];
    let node = lowestCostNode(costs,processed);

    while(node){
        let cost = costs[node].len;
        let children = g.adjList.get(node);
        
        for (let n in children) {
            let newCost = cost+children[n].len;
            
            if (!costs[n]) {
                
                costs[n] = {len:newCost}
                parents[n] = node;
            }
            if (costs[n].len > newCost) {
                costs[n].len = newCost
                parents[n] = node;
            }
        }
        processed.push(node)
        node = lowestCostNode(costs,processed)
    }
    
    let parent = parents[finish];
    let optimalPath = [[finish,costs[parent].len]];
    while(parent){
        if (costs[parent]) {
            optimalPath.push([parent,costs[parent].len]);    
        }else{
            optimalPath.push([parent,0])
        }
        parent = parents[parent];
    }

    optimalPath.reverse();

    const results = {
        distance: costs[finish].len,
        path:optimalPath,
    }
    
    return results;
}

export const getClosest = (coord, nodes) => {
    let min = Math.pow(10,1000);
    let closest = "";
    Object.keys(nodes).forEach(item=>{
        let node_coord = nodes[item].geometry.coordinates;
        let dist = distance(coord,node_coord);
        if (dist<min) {
            min = dist;
            closest = nodes[item].properties.name;
        }
    })
    return [closest, min];
}

export const createJSON = (corners, data,sensors, support, max, entrance, floors) => {
    let json = {
        entrance:[],
        properties:{},
        sensors:{},
        support:{},
    };
    let num_spots = max;
    let num_avaliable = max;
    let status_array = new Array(num_spots).fill(0);
    let processed = [];
    //Updating status of random spots to 1
    for (let i = 0; i < Math.floor(max/2); i++) {
        let rand_index = Math.floor(Math.random()*status_array.length);
        if (!processed.includes(rand_index)) {
            status_array[rand_index] = 1;
            processed.push(rand_index);
            num_avaliable-=1;
        }
    }
    //Setting init lot values
    json.entrance = entrance;
    json.corners = corners;
    json.properties.name = data[1];
    json.properties.floors = floors;
    json.properties.total = num_spots;
    json.properties.avaliable = num_avaliable;
    
    //Adding sensors
    for (let i = 0; i < sensors.length; i++) {
        json.sensors = {
            ...json.sensors,
            [i]:{
                type:"sensor",
                properties:{
                    status:status_array[i],
                    floor:1,
                    name:"s"+i,
                },
                geometry:{
                    coordinates: sensors[i],
                }
            }
        }
    }
    //Adding support nodes
    for (let i = 0; i < support.length; i++) {
        json.support = {
            ...json.support,
            [i]:{
                type:"support",
                properties:{
                    floor:1,
                    name:"h"+i,
                },
                geometry:{
                    coordinates: support[i],
                }
            }
        }
    }
    
    return json;
}


export const assignSensor = (g, sensors, support, userPos) =>{
        //USE getCurrentPos as input parameter in addUserPosGraph or something when used in app        
        //using entrance as startpoint now
        
        addUserPosGraph(g, userPos, support);
        
        let min_dist = Math.pow(10,1000);
        let sensor = "";
        let path = [];
        Object.keys(sensors).forEach((key)=>{
            if (sensors[key].properties.status===0) {
                
                let dijskt = dijkstra(g, g.getNode("userPos"), g.getNode(sensors[key].properties.name));
                let dist = dijskt.distance;
                
                if (dist<min_dist) {
                    min_dist = dist;
                    sensor = sensors[key].properties.name;
                    path = dijskt.path;
                }
            }
        })

        return [sensor, path];
}
const addUserPosGraph = (g, pos, support) => {
    
    let closest = getClosest(pos, support);
    g.addVertex("userPos");
    g.addEdge("userPos",closest[0],closest[1],"");
}

export const createGraph = (sensors, support) => {
    let m = require("../adj_matrix.json");
    m = m.matrix;      
    let g = new Graph();
    let label = m[0];
    for (let i = 1; i < label.length; i++) {
        g.addVertex(label[i]);
    }
    
    for (let i = 1; i < m.length; i++) {
        for (let j = 1; j < m[i].length; j++) {
            if(m[i][j]===1){
                let from = 0;
                let to  = 0;
                
                if(label[i].split("")[0]==='h'){
                    Object.keys(support).forEach(item=>{
                        if (support[item].properties.name===label[i]) {
                            from = support[item].geometry.coordinates;
                        }
                    })
                }
                if(label[j].split("")[0]==='h'){
                    Object.keys(support).forEach(item=>{
                        if (support[item].properties.name===label[j]) {
                            to = support[item].geometry.coordinates;
                        }
                    })
                }
                if(label[i].split("")[0]==='s'){
                    Object.keys(sensors).forEach(item=>{
                        if (sensors[item].properties.name===label[i]) {
                            from = sensors[item].geometry.coordinates;
                        }
                    })
                }
                if(label[j].split("")[0]==='s'){
                    Object.keys(sensors).forEach(item=>{
                        if (sensors[item].properties.name===label[j]) {
                            to = sensors[item].geometry.coordinates;
                        }
                    })
                }
                g.addEdge(label[i],label[j],distance(from,to), latlngDist(from,to))
            }
        }
    }
    
    return g;
}

export const getPolyline  = (userPos,path, sensors, support) =>{
    let polyline = [];
    polyline.push(userPos);
    
    Object.keys(path).forEach((item)=>{        
        if (path[item][0].split("")[0]==="s") {                
            let nodeCoord = findNodeCoord(sensors,path[item][0])
            polyline.push({latitude:nodeCoord[0],longitude:nodeCoord[1]});
        }
        if (path[item][0].split("")[0]==="h") {
            let nodeCoord = findNodeCoord(support,path[item][0])
            polyline.push({latitude:nodeCoord[0],longitude:nodeCoord[1]});
        }
    })
    
    return polyline;
    
}

export const calcBBox = (points) =>{
    let ul = [Math.pow(10, 1000),-Math.pow(10, 1000)];
    let lr = [-Math.pow(10, 1000),Math.pow(10, 1000)];
    Object.keys(points).forEach((item)=>{
        if (points[item][0]<ul[0]) {
            ul[0] = points[item][0]
        }
        if (points[item][0]>lr[0]) {
            lr[0] = points[item][0]
        }
        if (points[item][1]>ul[1]) {
            ul[1] = points[item][1]
        }
        if (points[item][1]<lr[1]) {
            lr[1] = points[item][1]
        }
    })        
    return [ul, lr];
}

export const findNodeCoord = (nodes, nodeName) =>{
    let coord = []
    Object.keys(nodes).find((key)=>{    
        if (nodes[key].properties.name===nodeName) {            
            coord = nodes[key].geometry.coordinates;
        }
    })
    return coord;
}

export const findNodeIndex = (nodes, nodeName) => {
    let index = 0;
    Object.keys(nodes).find((key)=>{
        if (nodes[key].properties.name===nodeName) {
            index = key;
        }
    })
    return index;
}
// x=Rcosϕcosλ,y=Rcosϕsinλ,z=Rsinϕ
export const angleBetweenPoints=(p1,p2)=>{


    const dLng = p2.longitude - p1.longitude;
    const x = Math.cos(p2.latitude)*Math.sin(dLng);
    const y = Math.cos(p1.latitude)*Math.sin(p2.latitude)-Math.sin(p1.latitude)*Math.cos(p2.latitude)*Math.cos(dLng)
    
    let bearing = Math.atan2(x,y);

    bearing = toDegrees(bearing);
    bearing = (bearing + 360) % 360;
    bearing = 360-bearing;
    return bearing;
}

function toDegrees(radians){
  var pi = Math.PI;
  return radians * (180/pi);
}

export const getDirection = (angle) =>{
    if (angle<90) {
        return 1//"straigt"
    }else if(angle<180){
        return 2//"right"
    }else if(angle<270){
        return 3//"backwards"
    }else{
        return 4//"left"
    }
}

export const determimeDirection = (dir1,dir2) => {
    let sum = dir1-dir2
    
    if (sum===0)return "straight"
    else if (sum===-1||sum===3) return "Right"
    else if (sum===-2||sum===2) return "delete"
    else if (sum===-3||sum===1) return "Left"
}