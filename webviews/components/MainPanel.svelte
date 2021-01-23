<script>
import { onMount } from "svelte";
//const methodStorage = require('../../src/comp/storeMethods');


  //Bug!! = Doesnt sync information from WebView (If Sidebar not opened yet!)
  //Once its open its fine

  let idCount = 1;
  let nameArr = [];
  let mainData = [];

  onMount(()=>{

    const previousState = jsVscode.getState();
    if(previousState){
          console.log(previousState.list);
          nameArr = previousState.list;
    }
    window.addEventListener("message",(event) =>{
      const message = event.data //Json data

      switch(message.type){
        case "new-function": 
          nameArr = [...nameArr,{name: message.value.name,id:message.value.id}];
          idCount++;
          jsVscode.setState({list: nameArr});
        break;
      }
    })
  })

</script>


<style>
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

{#if idCount < 2}<h3>Use the addCase command to track functions</h3>{/if}
{#each nameArr as name,i}
  <div class="boxArea">
    <div>
      <h4>{name.name}</h4>
    </div>
    <div class="btnArea">
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
            jsVscode.setState({list: nameArr});
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
