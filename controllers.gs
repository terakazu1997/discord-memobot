/**
* MVCモデル、Controller層にあたるファイル　
*
* View層に処理を委譲する。
* 基本的に入力された単語の状態orスプレッドシートのoverwriteフラグの状態で呼び出すViewを変化させる。
*
* controllers.gs 
*/

function controller() {
    lastRow = dictSheet.getLastRow();
    wordList = dictSheet.getRange(1,2,lastRow).getValues();   
    keyword=keywordSplit(dictSheet.getRange("A2").getValue());
    dictSheet.getRange(2, 1).clear();
    operationFlag = dictSheet.getRange("D2").getValue();
    if(keyword === "")return;
    var targetCmd = keyword.slice(0,3);
    var findCmd = keyword.slice(0,5);
    
    //url判定
    if(targetCmd === "url" && operationFlag != "L"){
        urlCheckView(keyword);
        return;
    }
    
    //入力値置換の結果""になっていないか判定
    if (keyword === "NGワード"){
        sendToDiscordModel(msNoUseWord);
        return;
    }
    
    //操作フラグ判定　L（50件目以降のリスト表示） or I(追加）　U(意味更新） u(新単語更新）
    switch(operationFlag){
        //50件目以降のリストはnが入力された場合のみ次の50件を表示する。n以外が入力時は次の入力確認へ。
        case "L":  
            if(keyword === 'n'){
                listDefaultView();
                return;
            }
            dictSheet.getRange("D2").setValue('F');
            dictSheet.getRange("D3").setValue(0);
            break;
        case "I":
            insertView();
            return;
        case "U":
        case "u":
            updateView();
            return;
    }
    
    //入力値判定 help(ヘルプ表示） list -a,ls -a(全件表示）list,　ls(0〜50件目までのリスト表示)　
    switch (keyword){
        case "help":
            helpView();
            return;
        case "list -a":
        case "ls -a":
            listAllView();
            return;
        case "list":
        case "ls":
            listDefaultView();
            return;
    }
   
    //入力値判定2 前3文字がrm (削除）,　up (更新チェック)
    switch(targetCmd){
        case "rm ":
            removeView();
            return;
        case "up ":
            updateCheckView();
            return;
    }
   
   //入力値判定3 前5文字がfind　(文字一致検索)
    if(findCmd == "find "){
        findView();
        return;
    }
   
    //入力値判定4 入力された単語が存在する(単語の意味表示）
    if(wordMeanView()===true){
        return;
    }
   
    //追加チェック
    insertCheckView();
    return;
}