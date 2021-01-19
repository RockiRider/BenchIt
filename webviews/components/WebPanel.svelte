<script>
    import { onMount } from "svelte";
    
    /*
      Bug!!! = When switching views, all data disapears
    */
    
      let mainArr = [];
      let currentText = '';
    
      onMount(()=>{
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
            break;
            case "load-save":
              mainArr = message.data;
            break;
            case "onDelete":
              const newArr = mainArr.filter(data => data.name !== message.data.name && data.id !==  message.data.id);
              mainArr = newArr;
            break;
          }
        })
      })
    
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
  <button id="mainbtn">Test Performance</button>
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
<canvas id="myChart"></canvas>

<p>{JSON.stringify(mainArr,null,2)}</p>