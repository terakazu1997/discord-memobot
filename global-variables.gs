/**
* グローバル変数を定義するファイル
*
* global-variables.gs  
*/

var dictSheet=SpreadsheetApp.getActive().getSheetByName('辞書');
var lastRow;
var keyword;
var wordList;
var operationFlag;
var targetCnt;