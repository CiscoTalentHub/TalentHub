var search;
//var url = 'https://hiringsolved.com/api/v2/related?q=kubernetes&size=20&filter=true'

//$(document).ready(function(){
$.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
    }
});

function getWords(input1, results_body) {
    var search_word = document.getElementById(input1).value;
    document.getElementById("hubImage").style.display = 'none';
    //document.getElementById("hubImage").style.visibility = 'hidden';

    testBox(search_word, results_body);
}

function testBox(word, tab_button) {

    var url = "https://estasney.pythonanywhere.com/api/v2/related?q=" + word + "&scope=words&n=50";
    //Removes all the Buttons created from the last call
    document.getElementById(tab_button).innerHTML = "";

    //Add first keyword as button
    var x = document.createElement("INPUT");

    x.setAttribute("type", "button");
    x.setAttribute("class", "results_buttons");
    x.setAttribute("value", word);
    x.setAttribute("id", word);
    x.setAttribute("onclick", "getValue(this.id)");


    document.getElementById(tab_button).appendChild(x);
    //Gets the JSON info from external source
    $.getJSON(url, function(response) {
        //related is the dict in the returned json var response
        for (item in response[0].data) {
            var x = document.createElement("INPUT");


            var butId = response[0].data[item][0];
            var score = response[0].data[item][1];

            x.setAttribute("type", "button");
            x.setAttribute("class", "results_buttons");
            x.setAttribute("value", butId);
            x.setAttribute("id", butId);
            x.setAttribute("onclick", "getValue(this.id)");

            //document.body.appendChild(x);
            //var x = document.getElementById("myButton").value;
            //document.getElementById("demo").innerHTML = x;
            //var p_id = 'buttons' + butt_num;
            //document.getElementById(p_id).appendChild(x);
            document.getElementById(tab_button).appendChild(x);
        }

        console.log("> ", response);
        $("#viewer").html(response);
    });



}

//Determine which radio button is active and ..
//Gets the value of the resulting word and add it to the boolean search box
function getValue(clicked_id) {
    var txt = document.getElementById(clicked_id).value;
    txt = '"' + txt + '"';
    var bool_selected = document.querySelector('input[name = "input_radio"]:checked').value;
    //Get current value of text box that has focus
    search = document.getElementById(bool_selected).value;


    switch (bool_selected) {
        //Test the main boolean textarea for generated boolean string.  If exist then do not accept input from keyword buttons
        case 'bool1':
            if (search) {
                if (search[0] == '(') {
                    break;
                }
            }

        default:
            if (!search.includes(txt)) {
                if (search) {
                    search = search + " " + "OR" + " " + txt;
                    document.getElementById(bool_selected).value = search;
                } else {
                    search = txt;
                    document.getElementById(bool_selected).value = search;
                }
            }
    }
}
