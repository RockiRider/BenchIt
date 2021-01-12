<script>
import { onMount } from "svelte";

  let nameArr = [];

  onMount(()=>{
    window.addEventListener("message",(event) =>{
      const message = event.data //Json data
      console.log(message);
      switch(message.type){
        case "new-function": 
          nameArr = [...nameArr,{name: message.value}];
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

<button on:click={() =>{
  //Ignore the error below its getting pulled through on a previous script
  //Could try bringing it through here though?
  jsVscode.postMessage({
    type: "onInfo",
    value: ' suck my balls '
  })
}}>Tester</button>
{#each nameArr as name,i}
  <div class="boxArea">
    <div>
      <h4>{name.name}</h4>
    </div>
    <div class="btnArea">
      <button on:click={() =>{
        console.log(i);
        if (i > -1) {
          nameArr.splice(i, 1);
          console.log(nameArr);
          nameArr = nameArr;
        }
      }}>Remove</button>
    </div>
  </div>
{/each}
<p>{JSON.stringify(nameArr,null,2)}</p>
