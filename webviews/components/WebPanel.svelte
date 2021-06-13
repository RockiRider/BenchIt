

<svelte:head>
  

</svelte:head>

<script>
/**
 * Not Using this anymore, however useful for WebView Template if required!
 * This compenent has been discontinued.
 */


    import { onMount } from "svelte";

    //Plotly Stuff
    let trace1 = {
      x: ['Function 1', 'Function 2', 'Function 3'],
      y: [3, 6, 4],
      name: 'Control',
      error_y: {
          type: 'data',
          array: [1, 0.5, 1.5],
          visible: true
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
    
      //Data Stuff
      let mainArr = [];
      let currentText = '';


      var blob = new Blob(Array.prototype.map.call(document.querySelectorAll(
            'script[type=\'text\/js-worker\']'), function (oScript) {
            return oScript.textContent;
        }), {
            type: 'text/javascript'
        });

        // Creating a new document.worker property containing all our "text/js-worker" scripts.
        let something = new Worker(window.URL.createObjectURL(blob));
    
     
      onMount(()=>{
        //TODO: Should get from store as well!
        const previousState = jsVscode.getState();

        //Used for saving the state
        if(previousState !== undefined){
          console.log(previousState);
          mainArr = previousState.saved;
        }
        //Double loading??
        let script = document.createElement('script');
        script.src = "https://cdn.plot.ly/plotly-latest.min.js"
        document.head.append(script);

        

        script.onload = function() {
            Plotly.newPlot('myPlot', data, layout, {showSendToCloud:true});
        };

 
        window.addEventListener("message",(event) =>{
          const message = event.data //Json data
          switch(message.type){
            case "new-function":
              mainArr = [...mainArr,{
                name: message.data.name, 
                id:message.data.id, 
                start: message.data.start,
                finish:message.data.finish, 
                path:message.data.fsPath, 
                text: message.data.text
              }];
              jsVscode.setState({saved: mainArr});
              
              //syncUp(message.data);
            break;
            case "load-save":
              mainArr = message.data;
              jsVscode.setState({saved: mainArr});
            break;
            case "onDelete":
              const textIsCurrent = mainArr.some((data) => {
                return data.text == currentText && data.id == message.data.id
              })
              if(textIsCurrent){
                currentText = '';
              }
              const newArr = mainArr.filter(data => data.name !== message.data.name && data.id !==  message.data.id);
              mainArr = newArr;
              jsVscode.setState({saved: mainArr});
            break;
          }
        })
      })
      
      function callWorker(){
        //jsVscode.postMessage({type: "benchmark",value: "Lets See"})
        //console.log("call!");

        
        let methods = [];
        methods = mainArr.map( el => {
          const text = el.text;
          let temp = 'console.log("suck my balls");';
          let name = 'fun'+el.id;
          //TODO: Actual code inside the function as string to create a new function and slot it into the object!
          var fun = new Function(temp);

          const obj = {[name]: fun, params: 0};
          return obj;
        });
        console.log(methods);
        //Only works for void functions careful not to return anything!
       //methods[0].fun1();

       
        //something.postMessage('');
      }
      
      something.onmessage = function (oEvent) {
            let benchmarkResults = JSON.parse(oEvent.data);
            console.log(benchmarkResults);
            
      };

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

  #mainbtn {
      background-color: #111;
      color: #fff;
      cursor: pointer;
      border-color: #111;
      padding-left: 20px;
      padding-right: 20px;
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;
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

  canvas {
      max-width: 1300px;
      padding-left: 3%;
      padding-right: 3%;
  }
</style>

<h1 id="viewTitle">Live View</h1>
<div class="inputArea">
  <input type="number" value="1" id="numOfRuns" name="quantity" min="1" max="100">
  <button on:click={callWorker} id="mainbtn">Test Performance</button>
</div>
<div id="btnArea" class="btnArea">
  {#each mainArr as section,i}
    <button type="button" on:click={() =>{
      currentText = section.text;
      console.log(currentText);
    }} class="btn btn-primary" id='fun{section.id}'>{section.name}</button>
  {/each}
</div>
<div class="functionArea">
  <div class="functionTextArea">
    <pre id="functionText">{currentText}</pre>
  </div>
</div>
<div id="myPlot"></div>

<p>{JSON.stringify(mainArr,null,2)}</p>