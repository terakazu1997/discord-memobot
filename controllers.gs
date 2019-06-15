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
    keyword=dictSheet.getRange("A2").getValue();
    wordList = dictSheet.getRange(1,2,lastRow).getValues();
    overwriteFlg = dictSheet.getRange("D2").getValue();
    listcnt = dictSheet.getRange("D3").getValue();
    if(keyword === ""){
        return;
    }
    dictSheet.getRange(2, 1).clear();
    if (overwriteFlg === "L"){
      if(keyword === 'n'){
           listDefaultView();
           return;
      }
      dictSheet.getRange("D2").setValue('F');
      dictSheet.getRange("D3").setValue(0);
      listcnt = 0;
    }
    keyword = keywordSplit(keyword);
    if(keyword.slice(0,3) === "url"){
        urlCheckView(keyword);
        return;
    }
    if (keyword === "NGワード"){
        sendToDiscordModel(msNoUseWord);
        return;
    }

    if(overwriteFlg == "I"){
        insertView(keyword);
        return;
    }
    if(overwriteFlg.slice(0,1) == "U"){
        updateView(keyword);
        return;
    }
    if(keyword == "?help" || keyword == "？help"|| keyword == "help"){
        helpView();
        return;
    }
    if(keyword == "?list -a" || keyword=="？lｉst -a" || keyword == "？list -a"|| keyword == "list -a"){
        listAllView();
        return;
    }
    if(keyword == "?list" || keyword=="？lｉst" || keyword == "？list"|| keyword == "list"){
        listDefaultView();
        return;
    }
    if(keyword.slice(0,3) == "rm　" || keyword.slice(0,3) == "rm "){
        removeView(keyword);
        return;
    }
    if(keyword.slice(0,3) == "up " || keyword.slice(0,3) == "up　"){
        updateCheckView(keyword);
        return;
    }
    if(wordMeanView(keyword)===true){
        return;
    }
    insertCheckView(keyword);
    return;
}