<script>
import { onMount } from "svelte";
import basicStorage from '../../src/comp/storage/sideBasicMethods';
import dynamicStorage from '../../src/comp/storage/sideDynamicMethods';


  //Bug!! = Doesnt sync information from WebView (If Sidebar not opened yet!)
  //Once its open its fine

  let basicState = true;
  let disabledBasic = false;
  let disabledDynamic = false;
  let stateTitle = 'Basic Functions';

  let nameArr = [];
  let dynamicArr = [];
  let basicArr = [];

  onMount(()=>{

    if(basicState){
      disabledDynamic = false;
      disabledBasic = true;
    }else{
      disabledDynamic = true;
      disabledBasic = false;
    }
    console.log("Mounted");

    jsVscode.postMessage({type: "onMount",value:basicState});

    window.addEventListener("message",(event) =>{
      const message = event.data //Json data

      switch(message.type){
        case "new-function":{
          if(message.value.type == 'Basic'){
            basicArr = [...basicArr,{name: message.value.name,id:message.value.id}];
            if(basicState){
              nameArr = basicArr;
            }

          }else{
            dynamicArr = [...dynamicArr,{name: message.value.name,id:message.value.id}];
            if(!basicState){
              nameArr = dynamicArr;
            }
          }
          
        break;
        }     
        case "load-basic-save":{
          basicArr = message.value;
          nameArr = basicArr;
          //nameArr = nameArr;
          break;
        }
        case "load-dynamic-save":{
          dynamicArr = message.value;
          nameArr = dynamicArr;
          //nameArr = nameArr;
          break;
        }
      }
    })
  })

</script>


<style>
  .topArea{
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .topArea h1{
    margin-top: 0;
    margin-bottom: 0;
  }
  .topArea button{
    background-color: #3478dd;
    border: none;
    color: white;
    padding: 5px 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    cursor: pointer;
  }
  .boxArea{
    display: flex;
    width:100%;
    justify-content: space-between;
  }
  .boxArea h4{
    font-size: 14px;
  }
  .btnArea{
    display: flex;
    align-items: center;

  }
  .btnArea button{
    background-color: #f44336; 
    border: none;
    color: white;
    padding: 5px 12px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    cursor: pointer;
  }
  .btnStateArea{
    margin-top: 15px;
    margin-bottom:15px;
    width: 100%;
    height: 30px;
    display: flex;
  }
  .btnStateArea button{
    width: 48%;
    height: 100%;
    cursor: pointer;
    background-color: #0357d4;
    border: none;
    color: white;
    padding: 5px 0px;
    text-align: center;
    text-decoration: none;
    font-size: 12px;
  }
  .btnStateArea button:disabled{
    background-color: #062c64;
    cursor: default;
  }
  #right{
    margin-left: 1%;
  }
  #left{
    margin-right:1%;
  }

</style>
<div class="topArea">
  <h1>Tracked Functions</h1>
  <!-- svelte-ignore missing-declaration -->
  <button on:click={() =>{
    //Open Browser
    jsVscode.postMessage({type: "openBrowser"});
  }}>Open Browser</button>
</div>
{#if nameArr.length < 1}<h3>Use the addCase command to track functions</h3>{:else}<h3>{stateTitle}</h3>{/if}
<div class="btnStateArea">
  <button disabled={disabledBasic} id="left" on:click={() =>{
    basicState = true;
    stateTitle = 'Basic Functions';
    disabledDynamic = false;
    disabledBasic = true;
    nameArr = basicArr;
  }}>Basic</button>
  <button disabled={disabledDynamic} id="right" on:click={() =>{
    basicState = false;
    stateTitle = 'Dynamic Functions';
    disabledBasic = false;
    disabledDynamic = true;
    nameArr = dynamicArr;
    
  }}>Dynamic</button>
</div>
{#each nameArr as name,i}
  <div class="boxArea">
    <div>
      <h4>{name.name}</h4>
    </div>
    <div class="btnArea">
      <!-- svelte-ignore missing-declaration -->
      <button on:click={() =>{
        const methodName = name.name;
        const realID = name.id;
        if (i > -1) {
          try {
            //Update Backend
            if(basicState){
              jsVscode.postMessage({
                type: "onDelete-basic",
                name: methodName,
                id: realID
              })
            }else{
              jsVscode.postMessage({
                type: "onDelete-dynamic",
                name: methodName,
                id: realID
              })
            }
            //Update FrontEnd
            nameArr.splice(i, 1);
            nameArr = nameArr;
          } catch (error) {
            jsVscode.postMessage({
              type: "onError",
              value: 'Failed To Remove Function'
            })
          }
        }
      }}>Remove</button>
    </div>
  </div>
{/each}
<p>{JSON.stringify(nameArr,null,2)}</p>