// ==UserScript==
// @name         IQ.KARELIA.RU
// @namespace    http://iq.karelia.ru/
// @version      0.53
// @description  try to take over the world!
// @author       Aleksei Turcevich
// @match        http://iq.karelia.ru/next1.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @resource     new_logo https://raw.githubusercontent.com/alexproinc/iq.karelia.ru/master/iq_large.gif
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @source       https://github.com/alexproinc/iq.karelia.ru/
// @updateURL    https://github.com/alexproinc/iq.karelia.ru/raw/master/IQ.KARELIA.RU.user.js
// @downloadURL  https://github.com/alexproinc/iq.karelia.ru/raw/master/IQ.KARELIA.RU.user.js
// @supportURL   https://github.com/alexproinc/iq.karelia.ru/issues
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

$(document).ready(function() {
    var $=window.jQuery;
    var questionTable = $("table[bgcolor='#FAF3FF']");
    var questionDiv = questionTable.find('div');
    var questionTables = questionDiv.find('table');
    
    var answerTable = $("table[bgcolor='white']").not($("table[bgcolor='#FAF3FF']"));
    
    var questionState = $('font[color="#4040D0"]');
    var state = { current: 0, all: 0};
    var questionText = "";
    var center = $('center').first();
    
    GM_addStyle(".q {background: white; padding: 10px 30px; border: #faf3ff solid 3px;}");
    GM_addStyle(".qlist {background: cornsilk; text-align: left; width: 80%; margin: 20px; padding: 10px;}");
    $("img[height='90']").attr("src", GM_getResourceURL("new_logo"));
    questionDiv.css("background", "lightgray");

    questionTables.each(function( index ) {
        var kbd = $( this ).find("pre.kbd");
        var text = [];
        kbd.each(function( index ) {
            var clone = $(this).clone();
            $(clone).children("img").remove();
            text.push($(clone).text());
        });
        questionText += crosslines(text) + " ";
    });
    
    answerTable.each(function( index ) {
        var kbd = $( this ).find("pre.kbd");
        var text = [];
        kbd.each(function( index ) {
            var clone = $(this).clone();
            $(clone).children("img").remove();
            text.push($(clone).text());
        });
        // TODO
        //alert(crosslines(text));
    });
    
    var questionStateA = questionState.children("b").text().split('\u00A0');
    if (questionStateA.length > 3)
    {
        state.current = questionStateA[1];
        state.all = questionStateA[3];
        //questionState.text(state.current + ' ' + state.all);
        GM_setValue(state.current-1, questionText);
        center.append('<div class="qlist"><ol></ol></div>');
        for (var i = 0; i<state.current; i++)
        {
            center.find('ol').append("<li>" + GM_getValue(i, 'none o_O') + "</li>");
        }
    }
    
    questionTable.append('<div class="q">'+questionText+'</div>');

});