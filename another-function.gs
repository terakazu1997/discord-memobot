/**
* 小ネタ的な関数の置き場ファイル
*
* 例えばkeywordを分割したり、文字数を数えたりする関数等（随時追加予定)
*
* another-function.gs 
*/

function keywordSplit(keyword){
    keyword = keyword.toString();
    if(keyword.match(/(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/gi) != null){
        return "url"+keyword;
    }
    if(keyword.length > 1000){
        keyword = keyword.slice(0,1000);
    }
    keyword.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\udeff]',
        '\ud83e[\udd00-\udeff]',
        '\ud7c9[\ude00-\udeff]',
        '[\u2600-\u27BF]',
         '<@[0-9]+>',
         '<:.+:[0-9]+>',
         '~~.+~~',
         '__.+__',
         '_.+_',
         ','
    ];
    var ex = new RegExp(ranges.join('|'), 'g');
    keyword = keyword.replace(ex, ''); //ここで削除
    keyword = keyword.replace(/　/,' ');
    if(keyword === ""){
        return "NG"
    }
    return keyword;
}

/*Line一行の半角英語：39文字、半角数字37文字,全角文字20文字　最小公倍数28860
* それぞれ、28860を39,37,20で割る
*/
function strCount(str) {
    var len = 0;
    str = str.split("");
    for (var i=0;i<str.length;i++) {
        if (str[i].match(/[a-z ]/)){
            // 半角英語
            len+=740;
        } else if(str[i].match(/[0-9 ]/)) {
            // 半角数字
            len+=780;
        } else{
            len+=1443;
        }   
   }
   return len;
}