let xDataPoint = [];    //Remains the same accross functions
let yDataPoint = [];
let yErrorData = [];
let namesData = [];
/**
 * 
 * Trace objects for Plotly
 */
function Trace(xAxis,yAxis,errors,inName){
    this.x = xAxis;
    this.y = yAxis;
    this.error_y = {type: 'percent', array:  errors ,visible: true},
    this.name =  inName,
    this.mode = 'lines',
    this.type = 'scatter'
}

function createTraces(){
    let traceData = [];
    //2D array length = Num of functions?
    //Individual arrays inside the 2D, their lengths === xDataPoint.length
    //Maybe filter names array for triiple check length comparison??
    for(let i=0;i<yDataPoint.length;i++){
        let obj = new Trace(xDataPoint,yDataPoint[i],yErrorData[i],namesData[i]);
        traceData.push(obj);
    }


    return traceData;
}

function cleanDynamicData(){
    xDataPoint = [];    
    yDataPoint = [];
    yErrorData = [];
    namesData = [];
}

module.exports = {
// @ts-ignore
createTraces,xDataPoint,yDataPoint,yErrorData,namesData,cleanDynamicData,
}