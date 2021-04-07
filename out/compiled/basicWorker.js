/* eslint-disable no-undef */
// @ts-nocheck
importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.6/platform.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/benchmark/2.1.4/benchmark.min.js');

// Worker gets the msg
onmessage = function(e) {

  console.log('Message received from main script');
  let recieved = JSON.parse(e.data);
  let arrayOfTests = handleToFunction(recieved.allMethods);  //Sends in the array
  handleBenchmark(arrayOfTests).then((results)=>{
    postMessage(JSON.stringify(results));
  }).catch((error)=>{
    console.log('ERROR!');
    console.log(error);
    postMessage("Error!");
  });

    //const resultObj = {type:'results',data:workerResult};
  //postMessage(JSON.stringify(workerResult));  //Results get sent back
}

/**
 * 
 * @param {Array} input 
 */
function handleToFunction(input){

  let methods = [];
  methods = input.map( el => {           
      const text = el.text;
      let temp = text.substring(text.indexOf("{") + 1, text.lastIndexOf("}"));
      let name = 'fun'+el.id;
      console.log(el);

      if(el.examples.exampleData.numOfParams){
        const params = el.examples.exampleData.paramData.map(element =>{
          let arr = [];
          arr.push(element.name);
          return arr;
        })
  
        var fun = new Function([params],temp);
      }else{
        var fun = new Function(temp);
      }

      

      const obj = {[name]: fun, params: el.examples.exampleData.numOfParams, id:name,paramData:el.examples.exampleData.paramData};
      return obj;
  });
  return methods;
}

/**
 * 
 * @param {Array} input 
 */
function handleBenchmark(input){

  return new Promise(function (resolve, reject) {
    let suite = new Benchmark.Suite;
    let results = [];
    let winner = '';
    
    input.map(el =>{
      let name = el.id;
      let paramsExist = el.paramData;
      
      if(paramsExist){
        let params = paramsExist.map((el) => {
          let val = JSON.parse(el.value);
          return val;
        });
        suite.add(name, function () {
          el[name].apply(null,params);
        });
      }else{
        suite.add(name, function () {
          el[name]();
        });
      }
      
    })

    // add listeners if required
    suite.on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('error',function(){
      reject({result:'error!!',stats:results})
    })
    .on('complete', function () {
        console.log("Completed!");
        winner = this.filter('fastest').map('name');
        for (var i = 0; i < this.length; i++) {
            //console.log(this[i].hz + " ops/sec"); 
            //console.log(this[i].stats.rme + " Relative Margin of Error");
            let result = {
                ops: this[i].hz,
                rme: this[i].stats.rme
            }
            results.push(result);
        }
        resolve({result:winner,stats:results});
    })
    // .run({ 'async': true });
    .run();
  });
}



