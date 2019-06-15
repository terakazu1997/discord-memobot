/**
* グローバル変数を定義するファイル
*
* global-variables.gs  
*/

var dictSheet=SpreadsheetApp.getActive().getSheetByName('辞書');
var messageSheet = SpreadsheetApp.getActive().getSheetByName('メッセージ');
var infoSheet = SpreadsheetApp.getActive().getSheetByName('情報');
var lastRow;
var keyword;
var wordList;
var overwriteFlg;
var listcnt;