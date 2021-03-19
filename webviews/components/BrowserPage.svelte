

<svelte:head>
  

</svelte:head>

<script>
    import { onMount } from "svelte";

    const socket = new WebSocket('ws://localhost:52999');
    //const sharedWorker = require('./sharedWork');
    
    //Data Stuff
    let mainArr = [];
    let basicArr = [];
    let dynamicArr = [];
    
    let basicState = true;
    let stateTitle = 'Basic Functions';
    let disabledDynamic = false;
    let disabledBasic = true;


    let currentText = '';
    let benchResults = [];
    let resultState = '';

    //Plot Data

    let dataPoints = {
        x: [],
        y: [],
        error:[],
        color: ['#8D3B72', '#2c1b8f','#89A7A7','#06584c','#8b0955','#2B3D41','#4C5F6B','#83A0A0','#706993','#331E38']    //TODO: Dynamic colours!
    }

    const worker = new Worker('sharedWork.js');
    onMount(()=>{
       
        //Double loading??
        let script = document.createElement('script');
        script.src = "https://cdn.plot.ly/plotly-latest.min.js"
        document.head.append(script);

        
        /*
        script.onload = function() {
            createPlot();
        };
        */
        
        socket.addEventListener('open', function (event) {
            // Connection opened
            socket.send('requesting-basic');
            socket.send('requesting-dynamic');
        });

        socket.addEventListener('message', function (event) {
            const message = JSON.parse(event.data);
            switch(message.type){
                case "new-function":{
                    if(message.data.type == 'Basic'){
                        basicArr = [...basicArr,{
                            name: message.data.name, 
                            id:message.data.id, 
                            start: message.data.start,
                            finish:message.data.finish, 
                            path:message.data.fsPath, 
                            text: message.data.text,
                            example:message.data.examples
                        }];
                        if(basicState){
                            mainArr = basicArr;
                        }
                    }else{
                        dynamicArr = [...dynamicArr,{
                            name: message.data.name, 
                            id:message.data.id, 
                            start: message.data.start,
                            finish:message.data.finish, 
                            path:message.data.fsPath, 
                            text: message.data.text,
                            example:message.data.examples
                        }];
                        if(!basicState){
                            mainArr = dynamicArr;
                        }
                    }
                    
                    break;
                }
                case "load-basic-save":{
                    basicArr = message.data;
                    if(basicState){
                        mainArr = basicArr;
                    }
                    break;
                }
                case "load-dynamic-save":{
                    dynamicArr = message.data;
                    if(!basicState){
                        mainArr = dynamicArr;
                    }
                    break;
                }
                case "onDelete-basic":{
                    const textIsCurrent = basicArr.some((data) => {
                        return data.text == currentText && data.id == message.data.id
                    })
                    if(textIsCurrent){
                        currentText = '';
                    }
                    const newArr = basicArr.filter(data => data.name !== message.data.name && data.id !==  message.data.id);
                    basicArr = newArr;

                    if(basicState){
                        mainArr = basicArr;
                    }
                    break;
                }
                case "onDelete-dynamic":{
                    console.log("Here!");
                    const textIsCurrent = dynamicArr.some((data) => {
                        return data.text == currentText && data.id == message.data.id
                    })
                    if(textIsCurrent){
                        currentText = '';
                    }
                    const newArr = dynamicArr.filter(data => data.name !== message.data.name && data.id !==  message.data.id);
                    dynamicArr = newArr;
                    if(!basicState){
                        mainArr = dynamicArr;
                    }
                    break;
                }
            }
        });
    });
 
    function callWorker(){
        resultState = 'Loading ...';
        worker.postMessage(JSON.stringify({allMethods:mainArr})); 
    }

    worker.onmessage = function(e) {
        let msg = JSON.parse(e.data);
        console.log(msg);
        resultState = msg.result.join(' , ');
        benchResults = msg.stats;
        updateGraphData();
    }





    // Basic Functions graph stuff!!
    function updateGraphData(){
        if(mainArr.length !== benchResults.length){
            alert('Error function added/removed during benchmarking!');
            return;
        }
        console.log(benchResults);
        for(let i = 0; i<benchResults.length;i++){
            let element = mainArr[i];
            let resulting = benchResults[i];
            //Clean out the array
            dataPoints.x = [];
            dataPoints.y = [];
            dataPoints.error = [];

            dataPoints.x.push(element.name);
            dataPoints.y.push(resulting.ops);
            dataPoints.error.push(resulting.rme);
        }
        createPlot();   //Update Plot!
    }

    function createPlot(){
        //Plotly Stuff
        const trace1 = {
        x: dataPoints.x,
        y: dataPoints.y,
        name: 'Control',
        marker:{color: dataPoints.color},  //Store colour and 
        error_y: {
            type: 'percent',
            array: dataPoints.error,
            visible: true,
            marker:{color: 'red'}
        },
        type: 'bar'
        };
        let data = [trace1]
        let layout = {
            title: 'Benchmark Results',
            font: {
                size: 18
            },
            //barmode: 'stack',
            autosize: true // set autosize to rescale
        };
        Plotly.newPlot('myPlot', data, layout, {showSendToCloud:false});
    }
</script>


<style>
  body,
  html {
      width: 100%;
      height: 100%;
  }

  #viewTitle {
      text-align: center;
  }
  .resultsArea{
      display: flex;
      justify-content: center;
      text-align: center;
  }
  .inputArea {
      width: 100%;
      position: relative;
      display: flex;
      flex-flow: wrap;
      align-items: center;
      justify-content: center;
      margin-top: 25px;
      margin-bottom: 40px;
  }
  .inputArea button{
      background-color: #0357d4;
      color: #fff;
      cursor: pointer;
      padding-left: 20px;
      padding-right: 20px;
      border: 0;
    }
    #left{
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }
    #right{
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }
    .inputArea button:disabled{
        background-color: #062c64;
        cursor: default;
    }

  #mainbtn {
      background-color: #111;
      color: #fff;
      cursor: pointer;
      padding-left: 20px;
      padding-right: 20px;
      border: 0;
  }

  .btnArea {
      width: 95%;
      margin: auto;
  }

  .btn {
      margin-right: 5px;
  }

  .functionArea {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
  }

  .functionTextArea {
      width: 50%;
      margin: auto;
      text-align: justify;
      margin-top: 30px;
  }

  pre {
      background-color: #FCFAEE;
  }

  #fun1 {
      background-color: #8D3B72;
  }
  
  #fun2 {
      background-color: #2c1b8f;
  }

  #fun3 {
      background-color: #89A7A7;
  }

  #fun4 {
      background-color: #06584c;
  }

  #fun5 {
      background-color: #8b0955;
  }

  #fun6 {
      background-color: #2B3D41;
  }

  #fun7 {
      background-color: #4C5F6B;
  }

  #fun8 {
      background-color: #83A0A0;
  }

  #fun9 {
      background-color: #706993;
  }

  #fun10 {
      background-color: #331E38;
  }

  #myPlot {
      max-width: 1300px;
      padding-left: 3%;
      padding-right: 3%;
  }
</style>

<h1 id="viewTitle">Live {stateTitle}</h1>
<div class="inputArea">
    <button id="left" disabled={disabledBasic} on:click={() =>{
        basicState = true;
        stateTitle = 'Basic Functions';
        disabledDynamic = false;
        disabledBasic = true;
        currentText = '';
        mainArr = basicArr;
      }}>Basic</button>
    <button on:click={callWorker} id="mainbtn">Test Performance</button>
    <button id="right" disabled={disabledDynamic} on:click={() =>{
        basicState = false;
        stateTitle = 'Dynamic Functions';
        disabledBasic = false;
        disabledDynamic = true;
        currentText = '';
        mainArr = dynamicArr;
        
      }}>Dynamic</button>
</div>
<div class="resultsArea"><h4>{resultState}</h4></div>
<div id="btnArea" class="btnArea">
  {#each mainArr as section,i}
    <button type="button" on:click={() =>{
      currentText = section.text;
    }} class="btn btn-primary" id='fun{section.id}'>{section.name}</button>
  {/each}
</div>
<div class="functionArea">
  <div class="functionTextArea">
    <pre id="functionText">{currentText}</pre>
  </div>
</div>
<div id="myPlot"></div>