/*jslint browser: true*/
/*global $, jQuery, alert*/

let $ = require('jquery');

class copybutton {
    constructor(content, tag) {
        this.output = ('<br><center><textarea id=' + tag + ' rows="8" cols="70" style="overflow:hidden">' + content + '</textarea></center>');

        $(".hiddenpreview").on("click", "#" + tag, function() {
            console.log("I am handling this event.");
            $("#" + tag).select();
            document.execCommand("Copy");
        });
    }
}

function preview(ofthisfield, prefix) {
    splitintoposts(ofthisfield, prefix);
    let data = $(ofthisfield).val();
    let posts = new Array();
    let i = data.search(/ \(\d\/\d\)/);

    while (i > 0) {
        i += 8;
        posts.push(data.slice(0, i));
        data = data.slice(i);
        i = data.search(/ \(\d\/\d\)/);
        console.log(i);
    }
	
    $(".hiddenpreview").append("<center>Click each post to copy it.</center>");
    posts.push(data);
    var copybuttonarray = new Array();
    
    for (i = 0; i < posts.length; i++) {
        copybuttonarray[i] = new copybutton(posts[i], "paraCopy" + i);
        $(".hiddenpreview").append(copybuttonarray[i].output);     // Append new elements
    }
    
    $(".hiddenpreview").append("<br><br><center><button class=HPV>Done</button></center>");
    $(".hiddenpreview").slideToggle();
}



function splitintoposts(ofafield, prefix) {
    let data = $(ofafield).val();
    let formatted = "";
    let pagecount = 1 + Math.floor($(ofafield).val().length / 490);
    
    let pagenumber = 0;    
    let i = data.search(/ \(\d+\/\d+\)/);
    while(i > 0) {
        pagenumber += 1;
        i += 6;
        formatted += data.slice(0, i);
        data = data.slice(i);
        i = data.search(/ \(\d+\/\d+\)/);
    }

    while(data.length > 490) {
        pagenumber += 1;
        formatted += data.slice(0, 490) + " (" + pagenumber + "/" + pagecount + ")";
        data = "\n" + "\n" + prefix + data.slice(490);
    }

    data = formatted + data;
    $(ofafield).val(data);
}



function numofchars(ofafield) {
    return $(ofafield).val().length;
}



function chancheck(thefield, replacement) {
    let data = $(thefield).val();
    let dataflag = 0;
    
    // Loop through the data, see if there's any channels set.
    
    for (let i = 0; i < data.length; i++) {
        if(data[i] === '/') {
            dataflag++;
        }
    }
    
    // If no channels are set, we can simply prefix the channel.
    
    if(dataflag === 0) {
        if(replacement === 'e') {
            // If the channel is e, we have to add two chars.
            
            $(thefield).val('/' + 'em' + ' ' + $(thefield).val());
    
        } else {
            
            $(thefield).val('/' + replacement + ' ' + $(thefield).val());

        }        
    } else {
        // There are some channels that need to be changed. Find them.
        for (let i = 0; i < data.length; i++) {
            if(data[i] === '/' &&
               data[i + 1] != replacement) {
                switch(true) {
                    case(data[i+1] === 'p' || 
                        data[i+1] === 's' ||
                        data[i+1] === 'y'):
                        if(replacement === 'e') {
                            let beginning = data.slice(0, i + 1);
                            let end = data.slice(i + 2);
                            data = beginning + 'em' + end;
                        } else {
                            let beginning = data.slice(0, i + 1);
                            let end = data.slice(i + 2);
                            data = beginning + replacement + end;
                        }
                        break;

                    case(data[i+1] === 'e' &&
                         data[i+2] === 'm'):
                        if(replacement === 'e') {
                            let beginning = data.slice(0, i + 1);
                            let end = data.slice(i + 3);
                            data = beginning + 'em' + end;
                        } else {
                            let beginning = data.slice(0, i + 1);
                            let end = data.slice(i + 3);
                            data = beginning + replacement + end;
                        }
                        break;
                }
            }
        }
        $(thefield).val(data);
    }    
}



function checkforme(thefield) {
    let data = $(thefield).val();
    
    // Loop through the data, see if there's any channels set.
    
    for (let i = 0; i < data.length; i++) {
        if(data[i] === '/' && 
           data[i + 1] === 'm' && 
           data[i + 2] === 'e') {
            
            let beginning = data.slice(0, i + 1);
            let end = data.slice(i + 3);            
            data = beginning + 'em' + end;
        }
    }
    
    $(thefield).val(data);
}



$(document).ready(function () {
    var channelprefix = '';
    $(".hiddenpreview").toggle();

    $(".toParty").click(function () {
        channelprefix = '/p ';
        chancheck('#composition', 'p');
        $(".toParty").css("background", "#CC6600");
        $(".toSay").css("background", "");
        $(".toYell").css("background", "");
        $(".toEmote").css("background", "");

    });
    
    $(".toSay").click(function () {
        channelprefix = '/s ';
        chancheck('#composition', 's');
        $(".toParty").css("background", "");
        $(".toSay").css("background", "#CC6600");
        $(".toYell").css("background", "");
        $(".toEmote").css("background", "");
    });
    
    $(".toYell").click(function () {
        channelprefix = '/y ';
        chancheck('#composition', 'y');
        $(".toParty").css("background", "");
        $(".toSay").css("background", "");
        $(".toYell").css("background", "#CC6600");
        $(".toEmote").css("background", "");
    });

    $(".toEmote").click(function () {
        channelprefix = '/em ';
        chancheck('#composition', 'e');
        $(".toParty").css("background", "");
        $(".toSay").css("background", "");
        $(".toYell").css("background", "");
        $(".toEmote").css("background", "#CC6600");
    });
    
    
    $(".closeIt").click(function () {
        window.close();
    });

    
    
    $("#composition").keyup(function () {
            let characters = numofchars("#composition");
            $(".count").html(characters);
            $(".countnum").html(1 + Math.floor(characters / 500));
    });

    $("#composition").keydown(function () {
            let characters = numofchars("#composition");
            $(".count").html(characters);
            $(".countnum").html(1 + Math.floor(characters / 500));
    });
    
    setInterval(function () { 
            let characters = numofchars("#composition");
            $(".count").html(characters);
            $(".countnum").html(1 + Math.floor(characters / 500));        
    }, 500);
    
    $(".divide").click(function () {
        splitintoposts("#composition", channelprefix)
        let characters = numofchars("#composition");
        $(".count").html(characters);
        $(".countnum").html(1 + Math.floor(characters / 500));
    });
    
    $(".copyto").click(function () {
        checkforme('#composition');
        var copyText = document.querySelector("#composition");
        copyText.select();
        document.execCommand("Copy");
    });
    
    $(".clear").click(function () {
        channelprefix = '';
        $("#composition").val(channelprefix);
        let characters = numofchars("#composition");
        $(".count").html(characters);
        $(".countnum").html(1 + Math.floor(characters / 500));
        $(".toParty").css("background", "");
        $(".toSay").css("background", "");
        $(".toYell").css("background", "");
        $(".toEmote").css("background", "");
    });
    
    $(".doPreview").click(function () {
        preview("#composition", channelprefix);
    });

    $(".hiddenpreview").on("click", ".HPV", function() {
        console.log("I was clicked");
        $(".hiddenpreview").slideToggle();
        $(".hiddenpreview").empty();
    });
    
    $(".dsearch").click(function () {
        let searchterm = $(".dtsearch").val();
        window.open("http://www.dictionary.com/browse/" + searchterm + "?s=t", '_blank');
    });
    
    $(".tsearch").click(function () {
        let searchterm = $(".dtsearch").val();
        window.open("http://www.thesaurus.com/browse/" + searchterm + "?s=t", '_blank');
    });
    
    $(".dtsearch").keypress(function(event) {
        if(event.which == '13') {
            let searchterm = $(".dtsearch").val();
            window.open("http://www.dictionary.com/browse/" + searchterm + "?s=t", '_blank');
            $('.dtsearch').val('');
        };
    });
    
    
    
});