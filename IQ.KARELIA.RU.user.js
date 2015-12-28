// ==UserScript==
// @name         IQ.KARELIA.RU
// @namespace    http://iq.karelia.ru/
// @version      0.61
// @description  Modify the IQ user interface for better!
// @author       Aleksei Turcevich
// @match        http://iq.karelia.ru/enter.php?*
// @match        http://iq.karelia.ru/next1.php
// @match        http://iq.karelia.ru/finish.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      http://medialize.github.io/URI.js/src/URI.min.js
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

var IQ = new Object;

IQ.getId = function(url)
{
    if (typeof url == "object" && url instanceof URI)
    {
        this.id = url.search( true ).t_id;
        return this.id;
    }
    return -1;
}

IQ.getSubject = function()
{
    this.subject = $('font[color="B070B0"]').children('b').text();
    return this.subject.trim();
}

IQ.getQuestionData = function()
{
    
    var dataTables = $('table[bgcolor="white"]');
    var questionTable = dataTables.slice(0, 1);
    var answerTables = dataTables.slice(1, dataTables.length);

    var progress = this.extractProgress();
    var data = {
        text: this.extractQuestion(questionTable),
        answers:  this.extractAnswers(answerTables)
    }
    
    //this.questions = progress;
    this.questions = $.extend(progress, data);
    // TODO: Add questions to array
    return data;
}

IQ.extractProgress = function()
{
    var elm_progress = $('font[color="#4040D0"]');
    var progress = elm_progress.children("b").text().split('\u00A0');
    if (progress.length > 3)
        return {current: progress[1], total: progress[3]};

    return undefined;
}

IQ.extractQuestion = function(questionTable)
{
    var question = '';
    
    if (questionTable.parents('table[bgcolor="#FAF3FF"]').length !== 1)
        return question;
    
    var kbd = questionTable.find('pre.kbd');
    if (kbd.length > 0)
    {
        var text = [];
        kbd.each(function( index ) {
            var clone = $(this).clone();
            $(clone).children("img").remove();
            text.push($(clone).text());
        });
        question += this.mergeKbd(text) + " ";
    }
    else
    {
        var text = questionTable.find('font[size="2"]');
        if (text.length === 1)
            question = text.html();
    }
    return question.trim();
}

IQ.extractAnswers = function(answerTables)
{
    var answers = [];
    
    answerTables.each(function(){
        if ( !($( this ).find('span.answ').length > 0))
            return;
        
        var parts = $( this ).find('tr').first().children('td');
        if (parts.length !== 2)
            return;
        
        var answer = IQ.extractAnswer(parts.first(), parts.last());
        answers.push(answer);
    });
    
    return answers;
}

IQ.extractAnswer = function(elm_id, elm_answ)
{
    var id = elm_id.find('input[name="a_form_id[]"]').val();
    var type = elm_id.find('input[name="a_form_id[]"]').attr('type');
    var answer = '';
    
    var kbd = elm_answ.find('pre.kbd');
    if (kbd.length > 0)
    {
        var text = [];
        kbd.each(function( index ) {
            var clone = $(this).clone();
            $(clone).children("img").remove();
            text.push($(clone).text());
        });
        answer += this.mergeKbd(text) + " ";
    }
    else
    {
        var text = elm_answ.find('span.answ');
        if (text.length === 1)
            answer = text.html();
    }
    
    return {id: id, text: answer.trim(), type: type};
}


IQ.mergeKbd = function(lines) {
    var str = [];
    for (var j = 0; j < lines.length; j+=2)
    {
        var n = Math.min(lines[j].length, lines[j+1].length);
        for (var i = 0; i < n; i++) {
            if (lines[j][i] == " " && lines[j+1][i] != " ")
                str.push(lines[j+1][i]);
            else
                str.push(lines[j][i]);
        }
    }
    return str.join('').trim();
}

var drawNextPage = function()
{
    
    var form = $('<form/>', {
        name: 'formtosend',
        method: 'post',
        onsubmit: 'return check2click()'
    });
    
    var wrapper = $('<div/>', {class: 'wrapper'});
    
    var title = $('<div/>', {id: 'title'});
    var label = $('<div/>', {
        class: 'label',
        text: 'Тест: ' + IQ.subject
    });
    var progress = $('<div/>', {
        class: 'progress',
        text: 'Вопрос '+IQ.questions.current+' из '+IQ.questions.total
    });
    var clear = $('<div/>', {class: 'clear'});
    
    var quiz = $('<div/>', {id: 'quiz'});
    var question = $('<p/>', {html: IQ.questions.text});
    var answers = $('<ul/>');

    for (var index = 0; index < IQ.questions.answers.length; index++)
    {
        var answer = $('<li/>');
        var a_input = $('<input/>', {
            id: 'answ'+index,
            type: IQ.questions.answers[index].type,
            name: 'a_form_id[]',
            value: IQ.questions.answers[index].id
        });
        var a_label = $('<label/>', {
            for: 'answ'+index,
            html: IQ.questions.answers[index].text
        });
        
        answer.append(a_input).append(a_label);
        answers.append(answer);
    }
    
    var submit = $('<div/>', {id: 'submit'});
    var button = $('<input/>', {
        type: 'submit',
        name: 'send',
        value: 'Отослать ответ'
    });
    
    $('center').find('center').first().replaceWith(wrapper);
    title.append(label).append(progress).append(clear);
    quiz.append(question).append(answers);
    submit.append(button);
    wrapper.append(title).append(quiz).append(submit).wrap(form);
}

$(document).ready(function() {
    var $=window.jQuery;
    $.getScript( "http://medialize.github.io/URI.js/src/jquery.URI.min.js" );
    
    
    var CSS = '.wrapper{font-family:arial;text-align:left;width:85%}#title{background:#f8f0f6;font-size:.8em}#title .label{float:left;color:#d04060}#title .progress{text-align:center;background:#f0e2f0;color:#4040d0;width:25%;float:right}#title .label,#title .progress{font-weight:600;padding:5px 10px}#quiz{background:#fff;border:2px solid #faf3ff;margin-top:2em;padding:5px 30px}#quiz ul{font-size:.8em;color:#4040d0;list-style:none;padding-left:1em}#quiz li{display:block;margin-bottom:.7em}#quiz input{margin-right:15px;float:left;clear:right}#submit{background:#f8f8ff;text-align:center;margin:2em auto 0;padding:10px 0;width:400px}.clear{clear:both}';
    GM_addStyle(CSS);
    
    IQ = $.extend(JSON.parse(GM_getValue('IQ')), IQ);
    
    var url = new URI();
    switch(url.path())
    {
        case '/enter.php':
            IQ.getId(url);
            IQ.getSubject();
            break;
        case '/next1.php':
            var q = IQ.getQuestionData();
            drawNextPage();
            break;
        case '/finish.php':
            //alert('Finish!');
            // TODO: Print all question and the selected answers!
            IQ = '';
            break;
    }
    
    GM_setValue('IQ', JSON.stringify(IQ));

});


