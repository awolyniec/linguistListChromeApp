// the button that is clicked gets the buttonActive class
function activityButton(button) {
    $('#btn_latest, #btn_all, #btn_books, #btn_calls, #btn_conf, #btn_disc, #btn_dise, #btn_fyi, #btn_intern, #btn_jobs, #btn_media, #btn_queries, #btn_bookRev, #btn_software, #btn_summaries, #btn_support, #btn_journal, #btn_favorites').removeClass('buttonActive');
    $('#' + button).addClass('buttonActive');
}
// get the issue numbers of issues saved in favorites
function getFavIssueNum(){
    chrome.storage.sync.get(null, function (items) {

        favorites_issues = [];
        $.each(items, function (key, value) {
            favorites_issues.push(key);
        });
        console.log("favorites issues aft push onload: " + favorites_issues);
    });

}

// function that is called favorites is clicked, it gets the feeds save in localstorage
function parseFavorites(favorites) {
    var ul = document.getElementById("ul_feeds");
    $(ul).empty(); // empties the ul if there was a feed there before
    var docfrag = document.createDocumentFragment();
    var i = 0; // i is here so i know which element is clicked and which element to toggle

    $.each(favorites, function (key, value) {
        // console.log(key, value);
        var title = value.title;
        var content = value.content;
        var author = value.author;
        var pubDate = value.date;
        var link = value.link;
        //console.log('author: ' + author);

        var li = document.createElement("li");
        li.setAttribute('id', "li" + i);

        // div containing title, and arrow picture
        var el_content_top = document.createElement('div');
        el_content_top.setAttribute('id', "rss_content_top" + i);
        el_content_top.setAttribute('id2', i);
        el_content_top.addEventListener('click', function () {
            $("#rss_content" + $(event.target).attr('id2')).toggle();
            $("#rss_content" + $(event.target).attr('id2')).toggleClass('active2');
            $(event.target).toggleClass('active');
            $("#rss_content_top" + $(event.target).attr('id2')).toggleClass('top_content');

            if (("../assets/icons/uparrow46.png".localeCompare($("#img" + $(event.target).attr('id2')).attr('src'))) === 0) {
                $("#img" + $(event.target).attr('id2')).attr('src', '../assets/icons/downarrow24.png');
            } else {
                $("#img" + $(event.target).attr('id2')).attr('src', '../assets/icons/uparrow46.png');
            }

        }, false);

        el_content_top.addEventListener('mouseover', function () {
            $("#img" + $(event.target).attr('id2')).addClass('hover_img');
        }, false);

        el_content_top.addEventListener('mouseout', function () {

            $("#img" + $(event.target).attr('id2')).removeClass('hover_img');
        }, false);

        var el_title = document.createElement('p');
        el_title.setAttribute('id', "title" + i);
        el_title.setAttribute('class', "title");
        el_title.setAttribute('id2', i);
        var text_title = document.createTextNode(title);
        el_title.appendChild(text_title);

        var imgArrow = document.createElement('img');
        imgArrow.setAttribute('src', '../assets/icons/downarrow24.png');
        imgArrow.setAttribute('class', 'arrow');
        imgArrow.setAttribute('id', 'img' + i);

        el_content_top.appendChild(el_title);
        el_content_top.appendChild(imgArrow);
        li.appendChild(el_content_top);

        // main div containing rss elements like, description, content, author, date, link
        var el_content = document.createElement('div');
        el_content.setAttribute('id', "rss_content" + i);
        el_content.setAttribute('class', "rss_content");

        var hr = document.createElement('hr');
        el_content.appendChild(hr);

        //  the rss content
        var feed_content = document.createElement('p');
        var text_content = document.createTextNode("TEST Content: Applications are invited for one non-tenure-track, full-time instructor position at Saint Michael's College. Saint Michael's is a liberal arts and sciences college founded by the Society of Saint Edmund with over 60 years of experience in international education. The Applied Linguistics Department (ALD) offers several major programs: An Intensive English Program, an Academic English Program, and various TESOL programs. The ideal candidate will be willing to teach across programs and have documented success in teaching and teacher preparation, with availability to teach in summers for additional compensation. The candidate should also have experience with, and willingness to develop distance learning modes of course delivery. General responsibilities include teaching and curriculum planning in all major ALD programs, as well as some departmental service responsibilities. A Master’s in TESOL or Applied Linguistics is required. The Instructor position is a non-tenure track, full-time appointment, renewable on an academic year basis. Instructors are considered part of the Faculty Assembly of the College, and thus have voting rights. They are eligible to serve on College committees by appointment, but not by election by the faculty. Instructors are required to attend meetings in the respective programs in which they teach. Opportunities for professional development are available in the department including funding for attending conferences, and workshops within the department and elsewhere at Saint Michael's College. ");
        feed_content.setAttribute('id', 'content' + i);
        feed_content.appendChild(text_content);
        el_content.appendChild(feed_content);

        var hr2 = document.createElement('hr');
        el_content.appendChild(hr2);

        // the rss author
        var el_author = document.createElement('p');
        el_author.innerHTML = author;
        el_author.setAttribute('id', 'author' + i);
        el_author.setAttribute('class', 'rssADL');
        el_content.appendChild(el_author);

        // the rss date
        var el_date = document.createElement('p');
        var feed_date = document.createTextNode(pubDate);
        el_date.setAttribute('id', 'date' + i);
        el_date.setAttribute('class', 'rssADL');
        el_date.appendChild(feed_date);
        el_content.appendChild(el_date);

        // the rss link
        var el_link = document.createElement('a');
        var feed_link = document.createTextNode("Original issue: " + link);
        el_link.setAttribute('href', link);
        el_link.setAttribute('target', '_blank');
        el_link.setAttribute('id', 'link' + i);
        el_link.setAttribute('class', 'rssADL');
        el_link.appendChild(feed_link);
        el_content.appendChild(el_link);

        // social buttons div       
        var el_social = document.createElement('div');
        el_social.setAttribute('id', 'social_div');

        var el_social1 = document.createElement('div');
        el_social1.setAttribute('id', 'social_div1'); // face
        el_social1.setAttribute('id2', i);
        el_social1.addEventListener('click', function () {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + $("#link" + $(event.target).attr('id2')).attr('href'));
            //window.open('https://www.facebook.com/dialog/feed?app_id=145634995501895&display=popup&caption=An%20example%20caption &link=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer', 'width=600, height=600');
        }, false);
        el_social.appendChild(el_social1);

        var el_social2 = document.createElement('div');
        el_social2.setAttribute('id', 'social_div2');  // mail
        el_social2.setAttribute('id2', i);
        el_social2.addEventListener('click', function () {
            console.log('soc_div mail clciked');
            var sub = "Linguist list issue";
            var body = ("Link to issue: " + $("#link" + $(event.target).attr('id2')).attr('href'));
            var mail = "mailto:" + "?subject=" + sub + '&body=' + body;
            window.open(mail);
        }, false);

        el_social.appendChild(el_social2);

        var el_social3 = document.createElement('div');
        el_social3.setAttribute('id', 'social_div3');
        el_social3.setAttribute('id2', i);
        el_social3.addEventListener('click', function () {
            var title = $("#title" + $(event.target).attr('id2')).html();
            var content = $("#content" + $(event.target).attr('id2')).html();
            var author = $("#author" + $(event.target).attr('id2')).html();
            var date = $("#date" + $(event.target).attr('id2')).html();
            var link = $("#link" + $(event.target).attr('id2')).attr('href');
            console.log('soc_div favs clciked');


            //chrome.storage.sync.clear(function() {});
            var issueTitle = $("#title" + $(event.target).attr('id2')).html();
            var issNum = issueTitle.substr(0, issueTitle.indexOf(","));

            chrome.storage.sync.remove(issNum);
            $('#li' + $(event.target).attr('id2')).fadeOut();

            //$(event.target).attr('src', '../assets/icons/uparrow46.png');


        }, false);

        el_social.appendChild(el_social3);

        el_content.appendChild(el_social);

        li.appendChild(el_content);


        // added a bottom div filled with color just to make it prettier          
        var el_btm = document.createElement('div');
        el_btm.setAttribute('id', 'btm_div');
        li.appendChild(el_btm);

        docfrag.appendChild(li);

        i++;

    }); // end for each
    ul.appendChild(docfrag);

} // end parseFavorites


function getFeed(feed_link) {

    var jqxhr = $.get(feed_link, function (data) {

        // if success call parse func
        parseData(data);

    })
        .done(function () {
            console.log("second success");
        })
        .fail(function () {
            console.log("error");
            var docfrag = document.createDocumentFragment();

            var noFeeds = document.getElementById("noFeeds");
            $(noFeeds).empty();
            var noFeedsText = document.createTextNode("Problems with your internet :(");
            noFeeds.appendChild(noFeedsText);
            // if failed get data from storage and call parse func

        }) // end fail
        .always(function () {
            console.log("finished");
        });


} // end function getFeed

function parseData(data) {

    // var ul = document.getElementsByTagName("ul")[0]; // assuming it exists
    var ul = document.getElementById("ul_feeds");
    // empties the ul if there was a feed there before
    $(ul).empty();

    var docfrag = document.createDocumentFragment();

    var noFeeds = document.getElementById("noFeeds");
    $(noFeeds).empty();
    feedTest = $(data).find("item").find("title").text();
    if(!feedTest){
        console.log("feed test is empty, put new text");
        var noFeedsText = document.createTextNode("Nothing to show :(");
        noFeeds.appendChild(noFeedsText);

    }




// i is here so i know which element is clicked and which element to toggle
    var i = 0;
    $(data).find("item").each(function () {
        var el = $(this);
        var title = el.find("title").text();
        var link = el.find("link").text();
        var author = el.find("author").text();
        var pubDate = el.find("pubDate").text();

        var li = document.createElement("li");

        // div containing title, and arrow picture
        var el_content_top = document.createElement('div');
        el_content_top.setAttribute('id', "rss_content_top" + i);
        el_content_top.setAttribute('id2', i);
        el_content_top.addEventListener('click', function () {
            $("#rss_content" + $(event.target).attr('id2')).toggle();
            $("#rss_content" + $(event.target).attr('id2')).toggleClass('active2');
            $(event.target).toggleClass('active');
            $("#rss_content_top" + $(event.target).attr('id2')).toggleClass('top_content');

            if (("../assets/icons/uparrow46.png".localeCompare($("#img" + $(event.target).attr('id2')).attr('src'))) === 0) {
                $("#img" + $(event.target).attr('id2')).attr('src', '../assets/icons/downarrow24.png');
            } else {
                $("#img" + $(event.target).attr('id2')).attr('src', '../assets/icons/uparrow46.png');
            }

        }, false);

        el_content_top.addEventListener('mouseover', function () {
            $("#img" + $(event.target).attr('id2')).addClass('hover_img');
        }, false);

        el_content_top.addEventListener('mouseout', function () {

            $("#img" + $(event.target).attr('id2')).removeClass('hover_img');
        }, false);

        var el_title = document.createElement('p');
        el_title.setAttribute('id', "title" + i);
        el_title.setAttribute('class', "title");
        el_title.setAttribute('id2', i);

        var text_title = document.createTextNode(title);
        el_title.appendChild(text_title);

        var imgArrow = document.createElement('img');
        imgArrow.setAttribute('src', '../assets/icons/downarrow24.png');
        imgArrow.setAttribute('class', 'arrow');
        imgArrow.setAttribute('id', 'img' + i);

        el_content_top.appendChild(el_title);
        el_content_top.appendChild(imgArrow);
        li.appendChild(el_content_top);

        // main div containing rss elements like, description, content, author, date, link
        var el_content = document.createElement('div');
        el_content.setAttribute('id', "rss_content" + i);
        el_content.setAttribute('class', "rss_content");

        var hr = document.createElement('hr');
        el_content.appendChild(hr);

        //  the rss content
        var feed_content = document.createElement('p');
        var text_content = document.createTextNode("TEST Content: Applications are invited for one non-tenure-track, full-time instructor position at Saint Michael's College. Saint Michael's is a liberal arts and sciences college founded by the Society of Saint Edmund with over 60 years of experience in international education. The Applied Linguistics Department (ALD) offers several major programs: An Intensive English Program, an Academic English Program, and various TESOL programs. The ideal candidate will be willing to teach across programs and have documented success in teaching and teacher preparation, with availability to teach in summers for additional compensation. The candidate should also have experience with, and willingness to develop distance learning modes of course delivery. General responsibilities include teaching and curriculum planning in all major ALD programs, as well as some departmental service responsibilities. A Master’s in TESOL or Applied Linguistics is required. The Instructor position is a non-tenure track, full-time appointment, renewable on an academic year basis. Instructors are considered part of the Faculty Assembly of the College, and thus have voting rights. They are eligible to serve on College committees by appointment, but not by election by the faculty. Instructors are required to attend meetings in the respective programs in which they teach. Opportunities for professional development are available in the department including funding for attending conferences, and workshops within the department and elsewhere at Saint Michael's College. ");
        feed_content.setAttribute('id', 'content' + i);
        feed_content.appendChild(text_content);
        el_content.appendChild(feed_content);

        var hr2 = document.createElement('hr');
        el_content.appendChild(hr2);

        // the rss author
        var el_author = document.createElement('p');
        var text = document.createTextNode("Author: " + author);
        el_author.setAttribute('id', 'author' + i);
        el_author.setAttribute('class', 'rssADL');
        el_author.appendChild(text);
        el_content.appendChild(el_author);

        // the rss date
        var el_date = document.createElement('p');
        var feed_date = document.createTextNode("Date: " + pubDate);
        el_date.setAttribute('id', 'date' + i);
        el_date.setAttribute('class', 'rssADL');
        el_date.appendChild(feed_date);
        el_content.appendChild(el_date);

        // the rss link
        var el_link = document.createElement('a');
        var feed_link = document.createTextNode("Original issue: " + link);
        el_link.setAttribute('href', link);
        el_link.setAttribute('target', '_blank');
        el_link.setAttribute('id', 'link' + i);
        el_link.setAttribute('class', 'rssADL');
        el_link.appendChild(feed_link);
        el_content.appendChild(el_link);

        // social buttons div       
        var el_social = document.createElement('div');
        el_social.setAttribute('id', 'social_div');

        var el_social1 = document.createElement('div');
        el_social1.setAttribute('id', 'social_div1'); // face
        el_social1.setAttribute('id2', i);
        el_social1.addEventListener('click', function () {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + $("#link" + $(event.target).attr('id2')).attr('href'));
            //window.open('https://www.facebook.com/dialog/feed?app_id=145634995501895&display=popup&caption=An%20example%20caption &link=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer', 'width=600, height=600');
        }, false);
        el_social.appendChild(el_social1);

        var el_social2 = document.createElement('div');
        el_social2.setAttribute('id', 'social_div2');  // mail
        el_social2.setAttribute('id2', i);
        el_social2.addEventListener('click', function () {
            console.log('soc_div mail clciked');
            var sub = "Linguist list issue";
            var body = ("Link to issue: " + $("#link" + $(event.target).attr('id2')).attr('href'));
            var mail = "mailto:" + "?subject=" + sub + '&body=' + body;
            window.open(mail);
        }, false);

        el_social.appendChild(el_social2);

        var el_social3 = document.createElement('div');
        el_social3.setAttribute('id', 'social_div3');
        el_social3.setAttribute('id2', i);


        var issNum2 = title.substr(0, title.indexOf(","));
        if(favorites_issues.indexOf(issNum2) > -1){
            console.log("issue is in favs");
            el_social3.style.backgroundImage = "url(../assets/icons/star6y.png)";
        }else{
            console.log("issue not in favs");
        }

        el_social3.addEventListener('click', function () {
            var title = $("#title" + $(event.target).attr('id2')).html();
            var content = $("#content" + $(event.target).attr('id2')).html();
            var author = $("#author" + $(event.target).attr('id2')).html();
            var date = $("#date" + $(event.target).attr('id2')).html();
            var link = $("#link" + $(event.target).attr('id2')).attr('href');
            console.log('soc_div favs clciked');

            $(event.target).css('background-image', 'url(../assets/icons/star6y.png)');
            //chrome.storage.sync.clear(function() {});
            var issueTitle = $("#title" + $(event.target).attr('id2')).html();
            var issNum = issueTitle.substr(0, issueTitle.indexOf(","));
            var issue = '{ "title" : "' + title + '" ,' +
                '"content" : "' + content + '" ,' +
                '"date" : "' + date + '" ,' +
                '"link" : "' + link + '" ,' +
                '"author" : "' + author + '" }';
            var objIssue = JSON.parse(issue);
            //var content1 = $("#link" + $(event.target).attr('id2')).html();

            var storage = chrome.storage.local;
            var obj = {};
            obj[issNum] = objIssue;
            chrome.storage.sync.set(obj);


        }, false);

        el_social.appendChild(el_social3);
        el_content.appendChild(el_social);
        li.appendChild(el_content);


        // added a bottom div filled with color just to make it prettier          
        var el_btm = document.createElement('div');
        el_btm.setAttribute('id', 'btm_div');
        li.appendChild(el_btm);

        docfrag.appendChild(li);

        i++;
    }); // end for each
    ul.appendChild(docfrag);
} // end parseData


