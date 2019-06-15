/**
* MVCモデル、View層にあたるファイル　
*
* Controller層から関数を要求されて、Model層に操作を委譲。基本的には下記3処理を行う
* 1.Viewに対応するModelを呼び出し、Modelから返ってきたメッセージを受け取る
* 2.Modelから受け取ったメッセージを引数にし、sendToModel関数を呼び出し、Discordに送る
* 3.Controllerに処理の終了としてreturnを返す
*
* views.gs 
*/

function urlCheckView(keyword){
    var urlJudgeMessage= urlJudgeModel(keyword);
    sendToDiscordModel(urlJudgeMessage);
    return;
}

function insertView(keyword){
    var insertMessage = insertModel(keyword);
    sendToDiscordModel(insertMessage);
    return;
}

function updateView(keyword){
    var updateMessage = updateModel(keyword);
    sendToDiscordModel(updateMessage);
    return;
}

function removeView(keyword){
    var removeMessage = removeModel(keyword);
    sendToDiscordModel(removeMessage);
    return;
}

function updateCheckView(keyword){
    var updateCheckMessage = updateCheckModel(keyword);
    sendToDiscordModel(updateCheckMessage);
    return;
}

function wordMeanView(keyword){
    var wordMeanMessage = wordMeanModel(keyword);
    if(wordMeanMessage === false){
        return false;
    }
    sendToDiscordModel(wordMeanMessage);
    return true;
}

function insertCheckView(keyword){
    var insertCheckMessage = insertCheckModel(keyword);
    sendToDiscordModel(insertCheckMessage);
    return;
}

function helpView(){
    var helpMessage = helpModel();
    sendToDiscordModel(helpMessage);
    return;
}

function listAllView(){
    var listAllMessage = listAllModel();
    sendToDiscordModel(listAllMessage);
    return;
}
function listDefaultView(){
    var listMessage = listDefaultModel();
    sendToDiscordModel(listMessage);
    return;
}
