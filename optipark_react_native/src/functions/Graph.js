class Graph{

    constructor(noOfVertices){
        this.noOfVertices = noOfVertices;
        this.adjList = new Map();
        
    }

    addVertex = (v)=>{
        
        this.adjList.set(v,{})        
    }

    addEdge = (v,w, len) => {
        this.adjList.get(v)[w] = {len:len};
    }

    getNode = (node) =>{
        return [...this.adjList.keys()].find((item)=>item=== node);
    }

    // getNodeValue = (node) => {
    //     return this.adjList.get(node);
    // }

    getLength = () => {
        return this.adjList.size;
    }

    printGraph = () => {
        let keys = this.adjList.keys();
        
        for (let i of keys) {            
            let values = this.adjList.get(i);
            let conc = "";

            Object.keys(values).forEach((item)=>{
                conc+=item+", ";
            })
            console.log(i + " -> " + conc);
        }
    }
}

export default Graph;