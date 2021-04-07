const Excel = require('exceljs');
const path = require('path');

let firstCount = 0;
let secondCount = 0;
let current = path.join(__dirname,"/db/");

async function exRun(data){
    const workbook = new Excel.Workbook();

    firstCount++;
    secondCount++;

    workbook.xlsx.readFile(current+'stats.xlsx').then(function(){
            const firstFun = workbook.getWorksheet("function1");
            const secondFun = workbook.getWorksheet("function2");

            firstFun.columns = [
                {header: 'Test ID', key: 'id', width: 10},
                {header: 'Array Size', key: 'size', width: 10},
                {header: 'Name', key: 'name', width: 32}, 
                {header: 'Ops', key: 'ops', width: 15,},
                {header: 'Error Margin', key: 'rme', width: 15,}
            ];
        
            secondFun.columns = [
                {header: 'Test ID', key: 'id', width: 10},
                {header: 'Array Size', key: 'size', width: 10},
                {header: 'Name', key: 'name', width: 32}, 
                {header: 'Ops', key: 'ops', width: 15,},
                {header: 'Error Margin', key: 'rme', width: 15,}
            ];

            data.map(el => {
                let currentSize = el.size;
                let fun1 = el.fun1; //bubbleSort
                let fun2 = el.fun2; //mergeSort

                //Get Latest Rows
                let fLastRow = firstFun.lastRow;

	            // @ts-ignore
	            let getFRowInsert = firstFun.getRow(++(fLastRow.number));

                let sLastRow = secondFun.lastRow;
                // @ts-ignore
                let getSRowInsert = secondFun.getRow(++(sLastRow.number));
        
                //Add Rows
                getFRowInsert.values = {id:firstCount, size: currentSize, name: 'bubbleSort', ops: fun1.ops ,rme: fun1.rme};
                getSRowInsert.values = {id:secondCount, size: currentSize, name: 'mergeSort', ops: fun2.ops ,rme: fun2.rme};
        
            });



            return workbook.xlsx.writeFile(current+'stats.xlsx');
        });
    console.log("File is written");

};


module.exports = {
// @ts-ignore
    exRun,
}