<script>
import { onMount } from "svelte";

  let nameArr = [];

  onMount(()=>{
    window.addEventListener("message",(event) =>{
      const message = event.data //Json data
      console.log(message);
      switch(message.type){
        case "new-function": 
          nameArr = [{name: message.value},...nameArr];
        break;
      }
    })
  })
</script>

<h1>Hello!</h1>
<h2>Where the fuck am I??</h2>
<button on:click={() =>{
  //Ignore the error below its getting pulled through on a previous script
  //Could try bringing it through here though?
  jsVscode.postMessage({
    type: "onInfo",
    value: ' suck my balls '
  })
}}>Click me</button>

<p>{JSON.stringify(nameArr,null,2)}</p>