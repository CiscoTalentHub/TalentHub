function boolSearch(website) {
    //Get all the values from the search fields and pass it to the search function
    var bool1 = document.getElementById("bool1").value;

    //var title = document.getElementById("title").value;
    var title_list = document.getElementById("typeaheadmulti_title").getElementsByTagName("li");

    var title = '';
    if (title_list.length != 0) {
        for (i = 0; i < title_list.length; i++) {
            var title_item = title_list[i].innerHTML.split('<', 1);
            title_item = '"' + title_item + '"';
            if (i != (title_list.length - 1)) {
                title = title + "title:" + title_item + " OR ";
            } else {
                title = title + "title:" + title_item;
            }
            //title.push(title_item);
        }
        title = "(" + title + ")";
    }


    var company_list = document.getElementById("typeaheadmulti_company").getElementsByTagName("li");
    var company = '';
    if (company_list.length != 0) {
        for (i = 0; i < company_list.length; i++) {
            var company_item = company_list[i].innerHTML.split('<', 1);
            company_item = '"' + company_item + '"';
            if (i != (company_list.length - 1)) {
                company = company + "company:" + company_item + " OR ";
            } else {
                company = company + "company:" + company_item;
            }
            //title.push(title_item);
        }
        company = "(" + company + ")";
    }


    //Get Values from GeoArea list - returns a NodeList
    var geo_list = document.getElementById("typeaheadmulti_geo").getElementsByTagName("li");
    //var geo_array = get_geoArray();
    var code_array = [];

    //geo_array is declared in Custom_typeahead.js

    //Compare GeoArea list to geo_array to process listed locations
    for (i = 0; i < geo_list.length; i++) {
        for (n = 0; n < geo_array.length; n++) {
            //list_item is an array that contains GeoArea name
            //split because geo_list contains hidden html tags <i>
            var geo_item = geo_list[i].innerHTML.split('<', 1);
            if (geo_array[n].includes(geo_item[0])) {
                var code = geo_array[n].slice(geo_item[0].length);
                code_array.push(code);
                break;

            }
        }
    }


    openSearch(website, bool1, title, company, code_array);

}


function openSearch(website, bool, title, company, geo_array) {

    var search = "";
    var search_opt = "";
    //Construct the boolean string with the AND operators
    switch (website) {

        case 'linkedin':
            //Replace space and quotes with unicode equivelent
            search = bool.replace(/ /g, '%20').replace(/"/g, '%22');

            if (title) {
                var str_title = title.replace(/ /g, '%20');

                if (company.length != 0) {
                    //Job Title and Company is present
                    var str_company = company.replace(/ /g, '%20');
                    search = search + "%20AND%20" + str_title + "%20AND%20" + str_company;
                } else {
                    //Only Job Title is present
                    search = search + "%20AND%20" + str_title;
                }
            }
            else if(company.length != 0) {
                var str_company = company.replace(/ /g, '%20');
                search = search + "%20AND%20" + str_company;
            }

    } //End switch



    //Process the geocode

    var array_size = geo_array.length;
    var geo_string = "";

    for (i = 0; i < array_size; i++) {
        var code = geo_array[i].split('.');
        if (code.length == 4) {
            var geo_area = code[1];
            var geo_num = code[3];
            geo_string = geo_string + '"' + geo_area + "%3A" + geo_num + '"' + "%2C";
        } else {
            var geo_area = code[1];
            var geo_num = '0';
            geo_string = geo_string + '"' + geo_area + "%3A" + geo_num + '"' + "%2C";
        }

    }


    //Append the Geographic code if present
    if (array_size >= 1) {
        //remove the trailing comma "%2C"
        geo_string = geo_string.slice(0, -3);

        geo_string = "?facetGeoRegion=%5B" + geo_string + "%5D";
        //var linkedin_url = "https://www.linkedin.com/vsearch/p?keywords=" + search + "&f_G=" + geo_area + "%3A" + geo_num + "&rsid=2132689341487064709807&orig=ADVS";
        //var linkedin_url = "https://www.linkedin.com/vsearch/p?keywords=" + search + "&f_G=" + geo_string + "&rsid=2132689341487064709807&orig=ADVS";
        var linkedin_url = "https://www.linkedin.com/search/results/people/" + geo_string + "&keywords=" + search + "&origin=FACETED_SEARCH";

    } else {
        //var linkedin_url = "https://www.linkedin.com/vsearch/p?keywords=" + search + "&rsid=2132689341487321114500&orig=ADVS";
        var linkedin_url = "https://www.linkedin.com/search/results/people/?keywords=" + search + "&origin=FACETED_SEARCH";

    }

    //var linkedin_url = "https://www.linkedin.com/vsearch/p?keywords=" + str + "&openAdvancedForm=true&locationType=Y&f_G=" + geo_area + "%3A" + geo_num + "&rsid=2132689341487064709807&orig=ADVS";
    var win = window.open(linkedin_url, '_blank');
    if (win) {

        //Browser has allowed it to be opened
        win.focus();

    } else {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }

}

//Generates the boolean string by combining the main boolean and the optional operators.
function generateBoolean(generate, bool1, bool2, bool_not) {

    var boolString = "";

    //Construct the boolean string with the AND operators
    switch (generate) {

        case 'generate':
            if (bool1) {
                if (bool1[0] == "(") {
                    str_bool1 = bool1;
                } else {
                    var str_bool1 = bool1.trim();
                    str_bool1 = "(" + str_bool1 + ")";
                }
            } else {
                break;
            }

            if (bool2) {
                var str_bool2 = bool2.trim();
                str_bool2 = "(" + str_bool2 + ")";
                boolString = str_bool1 + " AND " + str_bool2;
            } else {
                boolString = str_bool1;
                break;
            }

    } //End switch

    //Append the NOT to the boolean string if present
    if (bool_not) {
        var str_not = bool_not.trim();
        str_not = "(" + str_not + ")";
        boolString = boolString + " NOT " + str_not;
    }

    //Update the Boolean textarea with the generated boolean string
    document.getElementById('bool1').value = boolString;
    document.getElementById("bool2").value = "";
    document.getElementById("bool_not").value = "";

}


//Clear and resets all Boolean search box to empty
function clearBoolean() {

    document.getElementById("bool1").value = "";
    document.getElementById("bool2").value = "";
    document.getElementById("bool_not").value = "";
    document.getElementById("company").value = "";
    $('#typeaheadmulti_title .ttmulti-selections').empty();
    $('#typeaheadmulti_company .ttmulti-selections').empty();
    $('#typeaheadmulti_geo .ttmulti-selections').empty();
    //Initialize geo_array to empty
    var geoarray = get_geoArray();

    init_geoArray();
    geoarray = get_geoArray();

    document.getElementById("radio1").checked = true;

    $("#bool2").css({
        "box-shadow": "",
        "border": ""
    });
    $("#bool_not").css({
        "box-shadow": "",
        "border": ""
    });

    $("#bool1").css({
        "box-shadow": "0 0 5px rgba(255, 102, 0, 1)",
        "border": "5px solid rgba(255, 102, 0, 1)"
    });

}
