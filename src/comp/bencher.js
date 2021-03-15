const Benchmark = require('benchmark');
const store = require('./storage/storeMethods');
let methods = [];


/**
 * Cannot benchmark here as Eval does not allow the storing of functions
 * Whilst new function only works with voids, hence does not work with my use case 
 *
 */

/**
 * Extract Store functions into callable function objects
 */
function extraction(){

    //console.log(JSON.stringify(methodsss));

    let allData = store.getStore();


    methods = allData.map( el => {
        //const funText = removeName(el.text,el.name);
        var fun = 23;
        let tempo = el.text;
        let temp  = `fun = ${tempo}​​`;

        console.log(temp);
        //eval(temp);
        console.log(typeof fun);
        const obj = {[el.id]:temp, params: 0}

        

        return obj;
    });

    

    //let fun = new function(string);
    //eval
    console.log(methods);
}
function removeName(string,name){
    //let trimmed =string.trim()
    let result = string.replace(name,'');
    return result;
}
function runIt(){
    extraction();
    /*
    var suite = new Benchmark.Suite;
    let results = [];
    const methods = {
        fun1: function (x) {
            console.log("Hello!!! Fun " + x);
        },
        fun2: function () {
            console.log("Hello!! FUN2");
        },
    };

    suite.add('fun1', function () {
        let x = 10;
        methods.fun1(x);
    })
    .add('fun2', function () {
        methods.fun2();
    })
    // add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log("Completed!");
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        for (var i = 0; i < this.length; i++) {
            //console.log(this[i].hz + " ops/sec");
            //console.log(this[i].stats.rme + " Relative Margin of Error");
            let result = {
                ops: this[i].hz,
                rme: this[i].stats.rme
            }
            results.push(result);
        }
    })
    // run async
    .run({
        'async': true
    });

    return results;
    */
   return 0
}





// @ts-ignore
//exports.getStore = getStore;

module.exports = {
	// @ts-ignore
    runIt,

}