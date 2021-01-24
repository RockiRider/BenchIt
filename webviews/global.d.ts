import * as _vscode from "vscode";

declare global {
  const jsVscode: {
    postMessage:any;
    getState: () => any;
    setState: (state: any) => void;
  };
  const apiBaseUrl: string;
  const Plotly: any
}