/**
* MVCモデル、Model層にあたるファイル　
*
* View層から関数を要求されて、基本的には下記3処理を行う
* 1.Discordにメッセージ送信する
* 2.Googleスプレッドシートに値を設定
* 3.Discordに設定するメッセージを取得して、View層に返す。
*
* models.gs 
*/


//引数：Discordに送信するメッセージ 戻り値：なし　Discordへメモの各種機能を使用した結果を送信する関数
function sendToDiscordModel(Message) {  
    //webhookurl
    var url = webhookUrl; 
    //データを設定（token,チャンネル名、メッセージ、　ユーザ名（memobot）)
    var data = {  
        'token' : token,
        "channel" : channelname,
        "content" : Message,  
        "username" : username,
        "parse":'full'
    }; 
    //データをJSON形式に整形して送信データにし送信できる準備をする
    var payload = JSON.stringify(data);  
    var options = {  
        "method" : "POST",  
        'payload' : data,
        'muteHttpExceptions': true
    }; 
    //Discordへ送信データを送信
    UrlFetchApp.fetch(url, options);  
    return;
}

/*Discordからスプレッドシートに追加されたURL文字列が単語として入力されたか意味として入力したかで処理を分岐させる関数
*  単語として入力された場合：msNGUrl関数を返し、ViewにURLは単語として登録できないよーと旨のメッセージを返す。
*　　　　意味として入力された場合：スプレッドシートに該当する単語の行にURLを設定し、Viewに登録が完了したよーという旨のメッセージを返す
*/
function urlJudgeModel(keyword){
    if(overwriteFlg == "I"){
        keyword = keyword.slice(3);
        dictSheet.getRange(lastRow, 3).setValue(keyword);
        dictSheet.getRange("D2").setValue('F');
        return msWord+dictSheet.getRange(lastRow,2).getValue()+msInsertUrl+keyword;
    }else {
        return msNGUrl;
    }
}

/*Discordからスプレッドシートに追加された文字列の意味を追加する関数
*  1.スプレッドシートの最終行に意味を登録する（スプレッドシートに単語は最終行に登録されているため）
*　　　　2.overWriteFlagを　Insert(I）→False(F)にする。
*  3.Viewに追加した単語と意味のメッセージを返す
*/
function insertModel(keyword){
    dictSheet.getRange(lastRow, 3).setValue(keyword);
    dictSheet.getRange("D2").setValue('F');
    return msWord+dictSheet.getRange(lastRow,2).getValue()+msInsertMean+keyword;
}

/*Discordからスプレッドシートに追加された文字列の意味を更新する関数
*  1.更新対象行に意味を登録する（overwriteFlagの2文字目以降から判断）
*　　　　2.overWriteFlagを　Update(U）→False(F)にする。
*  3.Viewに更新した単語と意味のメッセージを返す
*/
function updateModel(keyword){
    var upRow = overwriteFlg.slice(1);
    dictSheet.getRange(upRow, 3).setValue(keyword);
    dictSheet.getRange("D2").setValue('F');
    return msWord+dictSheet.getRange(upRow,2).getValue()+msUpMean+keyword;
}

/*Discordからスプレッドシートに追加された文字列の単語が格納されている行を削除する関数
*  1.削除対象行の削除をする
*  2.Viewに削除した単語のメッセージを返す
*/
function removeModel(keyword){
    var rmword = keyword.slice(3)
    for(var i =0; i< wordList.length; i++){
        checkWord = wordList[i].toString();
        checkWord = checkWord.replace(/,/g,'');
        if(checkWord === rmword){
            dictSheet.deleteRow(i+1);
            return rmword+msRemove;
        }
    }
    return rmword+msNoRemove;
}

/*Discordからスプレッドシートに追加された文字列が更新対象か、更新対象じゃないか、新規登録対象かをチェックする関数
*/
function updateCheckModel(keyword){
　　　　　　　　var upword = keyword.slice(3);
    if(upword.length >= 39){
    　　　　　　　　return msNoUpWord;
    }
    for(var i =0; i< wordList.length; i++){
        checkWord = wordList[i].toString();
        checkWord = checkWord.replace(/,/g,'');
        if(checkWord === upword){
            dictSheet.getRange("D2").setValue('U'+(i+1));
            return upword+msUpWord;
        }
    }
    dictSheet.getRange("D2").setValue('U'+(i+1));
    dictSheet.getRange(i+1,2).setValue(upword);
    return upword+msInsertWord;
}

/*Discordからスプレッドシートに追加された文字列が追加対象か、追加対象じゃないかをチェックする関数
*/
function insertCheckModel(keyword){
    if(keyword.length >= 39){
        return msNoInsertWord;
    }
    dictSheet.getRange(lastRow+1, 2).setValue(keyword);
    dictSheet.getRange(2,4).setValue('I');
    return keyword+msInsertWord;
}

/*Discordからスプレッドシートに追加された文字列の単語が登録済みか、登録済みでないかを調べ登録済みなら単語と意味を返す関数
*/
function wordMeanModel(keyword){
    var checkWord = "";
    var mean;
    for(var i =0; i< wordList.length; i++){
        checkWord = wordList[i].toString();
        checkWord = checkWord.replace(/,/g,'');
        if(checkWord === keyword){
            mean = dictSheet.getRange(i+1, 3).getValue();
            return msWord+keyword+msMean+mean;
        }
    }
    return false;
}

//helpメッセージを取得し、Viewに返す関数
function helpModel(){
    return msHelp;
}

//単語の文字列をリストとして取得してViewに返す関数
function listModel(){
    var words = msList;
    words += '-'+wordList[wordList.length-1]+ "　";
    var cnt = strCount(wordList[wordList.length-1].toString())+4;
    for(var i = wordList.length-2; i > 1 ;i--){
        cnt += strCount(wordList[i].toString())+4;
        if(cnt >= 40){
            words += String.fromCharCode(10);
            cnt = strCount(wordList[i].toString()) + 4;
        }
        words += '-'+wordList[i] + "　";
    }
    return words;
}