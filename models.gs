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
function urlJudgeModel(){
    if(operationFlag == "I"){
        var urlword = keyword.slice(3);
        dictSheet.getRange(lastRow, 3).setValue(urlword);
        dictSheet.getRange("D2").setValue('F');
        return dictSheet.getRange(lastRow,2).getValue()+msInsertUrl+msFindPromotion;
    }else {
        return msNGUrl+msFindPromotion;
    }
}

/*Discordからスプレッドシートに追加された文字列の意味を追加する関数
*  1.スプレッドシートの最終行に意味を登録する（スプレッドシートに単語は最終行に登録されているため）
*　　　　2.overWriteFlagを　Insert(I）→False(F)にする。
*  3.Viewに追加した単語と意味のメッセージを返す
*/
function insertModel(){
    dictSheet.getRange(lastRow, 3).setValue(keyword);
    dictSheet.getRange("D2").setValue('F');
    return dictSheet.getRange(lastRow,2).getValue()+msInsertMean+msFindPromotion;
}

/*Discordからスプレッドシートに追加された文字列の意味を更新する関数
*  1.更新対象行に意味を登録する（overwriteFlagの2文字目以降から判断）
*　　　　2.overWriteFlagを　Update(U）→False(F)にする。
*  3.Viewに更新した単語と意味のメッセージを返す
*/
function updateModel(){
    var targetCnt = dictSheet.getRange("D3").getValue();
    dictSheet.getRange("D2").setValue('F');
    dictSheet.getRange("D3").setValue(0);
    if(operationFlag == "u"){
        if(keyword.length >= 39){
    　　　　　　　　    return msNoUpWord;
        }
        dictSheet.getRange(targetCnt, 2).setValue(keyword);
        return keyword+msUpNewWord+msFindPromotion;
    }
    dictSheet.getRange(targetCnt, 3).setValue(keyword);
    return dictSheet.getRange(targetCnt,2).getValue()+msUpNewMean+msFindPromotion;
}

/*Discordからスプレッドシートに追加された文字列の単語が格納されている行を削除する関数
*  1.削除対象行の削除をする
*  2.Viewに削除した単語のメッセージを返す
*/
function removeModel(){
    var rmword = keyword.slice(3);
    for(var i =0; i< wordList.length; i++){
        checkWord = wordList[i].toString();
        if(checkWord.toLowerCase() === rmword.toLowerCase()){
            dictSheet.deleteRow(i+1);
            return checkWord+msRemove+msFindPromotion;
        }
    }
    return rmword+msNoRemove+msFindPromotion;
}

/*
* Discordからスプレッドシートに追加された文字列が単語か意味の更新対象か、、新規登録対象かをチェックする関数
* 単語が登録済みかつ　入力値がup -w　{word}：単語更新対象
* 単語が登録済みかつ入力値がup {word}:意味更新対象
* 上記2つに当てはまらず39文字以上：文字数制限
* その他：新規登録対象
* Viewに各メッセージを返す。
*/
function updateCheckModel(){
　　　　　　　　var upword = keyword.slice(3);
    var optionUpword = upword.slice(3);
    for(var i =0; i< wordList.length; i++){
        checkWord = wordList[i].toString();
        if(checkWord.toLowerCase() === upword.toLowerCase() || checkWord.toLowerCase() === optionUpword.toLowerCase()){
            dictSheet.getRange("D3").setValue(i+1); 
            if(keyword.slice(3,6)==='-w '){
                dictSheet.getRange("D2").setValue('u');
                return checkWord+msUpWord;
            }
            dictSheet.getRange("D2").setValue('U');
            return checkWord+msUpMean;
        }
    }
    dictSheet.getRange("D2").setValue('I');
    if(keyword.slice(3,6)==='-w '){
        if(optionUpword.length >= 39){
    　　　　　　　　    return msNoUpWord;
        }
        dictSheet.getRange(i+1,2).setValue(optionUpword);
        return optionUpword+msInsertWord;
    }
    if(upword.length >= 39){
        return msNoUpWord;
    }
    dictSheet.getRange(i+1,2).setValue(upword);
    return upword+msInsertWord;
}

/*
* Discordからスプレッドシートに追加された文字列が追加対象か、追加対象じゃないかをチェックする関数
* Viewに追加対象か追加対象でないかのメッセージを返す。
*/
function insertCheckModel(){
    //39文字以上の単語は追加不可能
    if(keyword.length >= 39){
        return msNoInsertWord+msFindPromotion;
    }
    dictSheet.getRange(lastRow+1, 2).setValue(keyword);
    dictSheet.getRange(2,4).setValue('I');
    return keyword+msInsertWord;
}

/*Discordからスプレッドシートに追加された文字列の単語が登録済みか、登録済みでないかを調べ登録済みなら単語と意味を返す関数
*/
function wordMeanModel(){
    var checkWord = "";
    var mean;
    for(var i =0; i< wordList.length; i++){
        checkWord = wordList[i].toString();
        if(checkWord.toLowerCase() === keyword.toLowerCase()){
            mean = dictSheet.getRange(i+1, 3).getValue();
            return msWord+checkWord+msMean+mean+msFindPromotion;
        }
    }
    return false;
}

//helpメッセージを取得し、Viewに返す関数
function helpModel(){
    return msHelp;
}

/*単語の文字列をリストとして全件取得してViewに返す関数
*  小文字大文字の組み合わせが40になるたびに改行（毎回+4しているのは、-と　空白分の文字数)
*  直近の単語から履歴表示したいからwordListの最大要素から取得
* 　　全単語を表示してViewに返す
*/
function listAllModel(){
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

//単語の文字列をリストとして最大50件取得してViewに返す関数
function listDefaultModel(){
    var listCnt = dictSheet.getRange("D3").getValue();
    var displayCnt = listCnt*50;
    var words = msListDefault+displayCnt+ "〜"+(displayCnt+50) +msDisplayCnt;
    var displayNumber = 1;
    words += '-'+wordList[wordList.length-displayCnt-1]+ "　";
    var cnt = strCount(wordList[wordList.length-1].toString())+4;
    for(var i = wordList.length-displayCnt-2; i > 1 ;i--){
        if(displayNumber == 50){
            dictSheet.getRange("D2").setValue('L');
            dictSheet.getRange("D3").setValue(listCnt+1);
            return words + msNextWord;
        }
        cnt += strCount(wordList[i].toString())+4;
        if(cnt >= 40){
            words += String.fromCharCode(10);
            cnt = strCount(wordList[i].toString()) + 4;
        }
        words += '-'+wordList[i] + "　";
        displayNumber += 1;
    }
    dictSheet.getRange("D3").setValue(0);
    return words+String.fromCharCode(10)+displayNumber+msDisplayResultCnt;
}

/*入力された文字列に含まれる全ての単語をViewに返す関数
*  見つかるたびに件数を１件追加
*  1件もなければ、見つからなかったメッセージをViewに返す
*  1件以上なら件数と、見つかった単語をViewに返す
*/
function findModel(){
    var findWord = keyword.slice(5);
    var findWords = findWord + msFindWord;
    var findCnt = 0;
    var checkWord = "";
    var cnt = 0;
    for(var i = 2; i < wordList.length; i++){
        checkWord = wordList[i].toString();
        if(checkWord.toLowerCase().match(findWord.toLowerCase())){
           cnt += strCount(checkWord)+4;
           if(cnt >= 40){
                findWords += String.fromCharCode(10);
                cnt = strCount(wordList[i].toString()) + 4;
           }
          　　findCnt +=1;
           findWords += '-'+ checkWord+"　";
        }
    }
    if(findCnt === 0){
        return  keyword.slice(5)+msNoFindWord+msHelpPromotion ;
    }
    return findWords +String.fromCharCode(10)+ findCnt + msFindCnt+msHelpPromotion ;
}