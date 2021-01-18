<script>
    import { onMount } from "svelte";
    
    
      let idCount = 1;
      let nameArr = [];
    
      onMount(()=>{
        window.addEventListener("message",(event) =>{
          const message = event.data //Json data
    
          switch(message.type){
            case "new-function": 
              nameArr = [...nameArr,{name: message.value,id:idCount}];
              idCount++;
            break;
          }
        })
      })
    
</script>

<h1>Hello its Tsot!</h1>