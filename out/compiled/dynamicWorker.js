/* eslint-disable no-undef */
// @ts-nocheck
importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.6/platform.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/benchmark/2.1.4/benchmark.min.js');

onmessage = function(e) {

    console.log('Message received from main script');
    let recieved = JSON.parse(e.data);
    let arrayOfTests = handleToFunction(recieved.allMethods);  //Sends in the array
    handleBenchmark(arrayOfTests).then((results)=>{
      console.log(results);
      postMessage(JSON.stringify(results));
    }).catch((error)=>{
      console.log('ERROR! '+error);
      console.log(error);
    });
  
}

function handleToFunction(input){

    let methods = [];
    methods = input.map( el => {    
        const text = el.text;
        let temp = text.substring(text.indexOf("{") + 1, text.lastIndexOf("}"));
        let name = 'fun'+el.id;
        //Check if its a recursive function!!
        
        if(temp.includes(el.name)){
            let originalName = el.name;
            var re = new RegExp(originalName,"g");
            temp = temp.replace(re, "arguments.callee");
            // console.log(el);
            // console.log(temp);
        }

        
  
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

function handleBenchmark(input){

    return new Promise(function (resolve, reject) {
        let largestSize = 0;
        let arrayInUse = [];
        let arr = []
        let results = [];
    
        input.map(el =>{
            let params = el.paramData[0];
            
            //TODO: Error handling, etc!
            //TODO: Handles only 1 parameter which we expect to be an array!
            if(params){
                arr = [...params.value[0]];
                //TODO: No need to ensure the sizes match
                if(arr.length > largestSize){
                    largestSize = arr.length;
                    arrayInUse = [...arr];
                }
            }
        });
        let size = arrayInUse.length;
        let interval;
        
        if(size< 100){
            interval = 10;
        }else{
            interval = (5 / 100) * size;
        }
        
        // Ready to benchmark!!
        for(let y = interval;y<=size;y+=interval){
            let suite = new Benchmark.Suite;
            input.map(el =>{
                let name = el.id;
                const current = arrayInUse.slice(0, y);
    
                suite.add(name, function () {
                    let arrs = current.slice();
                    el[name](arrs);
                });
            });
    
            // add listeners
            suite.on('cycle', function (event) {
                // console.log(String(event.target));
                 //console.log(current2);
                 //console.log(arr);
             })
             .on('error',function(error){
                console.log(error);
                reject({result:'error!!',stats:results})
              })
             .on('teardown',function(){
                 console.log("Tear-down");
             })
             .on('complete', function () {
                 let fastest = this.filter('fastest').map('name').toString();
                 console.log('Fastest is ' + fastest +" with "+y);
                 let minorRes = {winner:fastest,size:y};
                 for (var i = 0; i < this.length; i++) {
                     //console.log(this[i].hz + " ops/sec");
                     //console.log(this[i].stats.rme + " Relative Margin of Error");
                     let result = {
                         ops: this[i].hz,
                         rme: this[i].stats.rme
                     }
                     minorRes[this[i].name] = result;
                 }
                 results.push(minorRes);
             }).run({
                 'async': false
             });
        }
        resolve(results);
    });
}
  