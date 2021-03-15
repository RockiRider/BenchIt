<script>
import { onMount } from "svelte";
import methodStorage from '../../src/comp/storage/sideMethods';


  //Bug!! = Doesnt sync information from WebView (If Sidebar not opened yet!)
  //Once its open its fine

  let idCount = 1;
  let nameArr = [];
  let mainData = [];

  onMount(()=>{

    
    jsVscode.postMessage({type: "onMount"});
    /*
    const previousState = jsVscode.getState();
    if(previousState){
          console.log(previousState.list);
          nameArr = previousState.list;
    }
    */
    window.addEventListener("message",(event) =>{
      const message = event.data //Json data

      switch(message.type){
        case "new-function":{
          nameArr = [...nameArr,{name: message.value.name,id:message.value.id}];
          idCount++;
        break;
        }     
        case "load-save":{
          nameArr = message.value;
          nameArr = nameArr;
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
    background-color: #034cbb;
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

</style>
<div class="topArea">
  <h1>Tracked Functions</h1>
  <!-- svelte-ignore missing-declaration -->
  <button on:click={() =>{
    //Open Browser
    jsVscode.postMessage({type: "openBrowser"});
  }}>Open Browser</button>
</div>
{#if idCount < 2}<h3>Use the addCase command to track functions</h3>{/if}
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
            jsVscode.postMessage({
              type: "onDelete",
              name: methodName,
              id: realID
            })
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