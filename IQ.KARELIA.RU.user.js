// ==UserScript==
// @name         IQ.KARELIA.RU
// @namespace    http://iq.karelia.ru/
// @version      0.1
// @description  try to take over the world!
// @author       Aleksei Turcevich
// @match        http://iq.karelia.ru/next1.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var crosslines = function(lines) {
    var n = Math.min(lines[0].length, lines[1].length);
    var str = [];
    for (var i = 0; i < n; i++) {
        if (lines[0][i] == " " && lines[1][i] != " ")
            str.push(lines[1][i]);
        else
            str.push(lines[0][i]);
    }
    return str.join('');
}

// Your code here...
$(document).ready(function(){
    var $=window.jQuery;
    var questionTable = $("table[bgcolor='#FAF3FF']");
    var questionDiv = questionTable.find('div');
    var questionTables = questionDiv.find('table');
    var questionText = "";

    questionTables.each(function( index ) {
        var kbd = $( this ).find("pre.kbd");
        var text = [];
        kbd.each(function( index ) {
            $(this).children("img").remove();
            text.push($(this).text());
        });
        questionText += crosslines(text);
    });
    
    //alert(questionText);
    questionTable.append('<div>'+questionText+'</div>');
});