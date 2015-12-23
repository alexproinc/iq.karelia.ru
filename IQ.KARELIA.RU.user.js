// ==UserScript==
// @name         IQ.KARELIA.RU
// @namespace    http://iq.karelia.ru/
// @version      0.4
// @description  try to take over the world!
// @author       Aleksei Turcevich
// @match        http://iq.karelia.ru/next1.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @resource     new_logo https://raw.githubusercontent.com/alexproinc/iq.karelia.ru/master/iq_large.gif
// @grant        GM_getResourceURL
// @grant        GM_addStyle
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
    var questionText = "";
    
    GM_addStyle(".q {background: white; padding: 10px 30px; border: #faf3ff solid 3px;}");
    $("img[height='90']").attr("src", GM_getResourceURL("new_logo"));
    questionDiv.css("background", "lightgray");

    questionTables.each(function( index ) {
        var kbd = $( this ).find("pre.kbd");
        var text = [];
        kbd.each(function( index ) {
            $(this).children("img").remove();
            text.push($(this).text());
        });
        questionText += crosslines(text) + " ";
    });

    questionTable.append('<div class="q">'+questionText+'</div>');
});