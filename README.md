# BenchMe README for Visual Studio Code

A micro-benchmarking tool for developers with Live Programming aspects. Only supports JavaScript for now.

## **Disclaimer** this is still in Development!

## What the extension seeks to achieve

BenchIt aims to bring benchmarking into VSCode, making it easy for developers to micro-benchmark their JavaScript functions. 


**GIF HERE**
More Info Below:

## Pre-release use

If you want to try this out now, before its published as a VSCode extension, you will need the following:

- Node
- NPM
- VSCode

Clone this repository somewhere and open it with VSCode.

- Run `npm install` that will install all the dependancies
- Run `npm run watch` which will compile all the Svelte pages
- Press `F5` on the keyboard to run the extension inside VSCode or click `Run` and `Start Debugging`

You will now be able to use the extension in its current state, whilst debugging the extension.


### Bugs

As BenchIt is still pre-release, if you find any bugs or issues with it please feel free to open an issue on this repo.

The extension itself is a bit inefficient at the moment, but that will be polished later after all the functionality is up to speed.

### v0.5 Functionality
- Bencharmking isolated functions with visualised results
- Example Based declerations for a functions parameters
- Live function tracking (Any code changes update automatically)
- Recursive support
- Supports functions inside functions
- Benchmarking takes place on a different thread (Minimal performance impact)
- `Simple Benchmarks` support any number of parameters of any type
- `Dynamic Benchmarks` only support **one** parameter, which has to be an Array. You can randomley generate an array instead of writing it out as an example.
- The `Random Generation` only generates an array of type `Number`

### v0.5 Limitations
- Limited Example Based Programming
- Limited Error Handling
- Limited ES5 Support
- Does not support arrow functions
- Benchmarking not tested with promises/async functions yet

[Check whats left to complete before v1.0 here](https://github.com/RockiRider/BenchIt/projects/1)

## How to use it

- Open a `.js` file in VSCode
- Use the `addCase` VSCode command
- Enter in any functions name that is declared inside the currently open `.js` file.
- If the function takes in any parameters/or if you want to make this a dynamic benchmark you will have to declare some **examples** as exhibited [here]()
- Once the function is registered, its now being tracked and saved by the extension. You can remove the function from the dock whenever you wish via the sidebar.
- Click `Open Browser` and you can now benchmark all your tracked `Simple` or `Dynamic` functions. 



### Extra info
The benchmarking functionality is built ontop of Benchmark.js (formally utilised in JSPerf).

It's all on you to ensure that you micro-benchmark correctly.

However... we do try to help you along the way.

## How to benchmark correctly

