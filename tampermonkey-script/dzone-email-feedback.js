// ==UserScript==
// @name        DZone Email Feedback
// @namespace   http://mailer.dzone.com
// @include     http://mailer.dzone.com/*
// @version     1
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

jQuery(function() {

    var selector1 = "body > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content.full-width > table";
    var selector2 = "#header > tbody > tr:nth-child(2) > td > table:nth-child(1) > tbody > tr:nth-child(2) > td > table";
    var selector3 = "#header > tbody > tr:nth-child(2) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table";

//    console.log("script marker");
//    window.setTimeout(function() {

        var articles = [];

        var articleTable = jQuery(selector1);
        if (articleTable.length === 0) {
            articleTable = jQuery(selector2);
        }
        if (articleTable.length === 0) {
            articleTable = jQuery(selector3);
        }

        var rows = articleTable.find('tr');

        var articleIndex = 0;
        rows.each(function(index, row) {
            var columns = jQuery(row).find('td');
            if (columns.length === 2) {

                var articleDetails = {
                    title: jQuery(columns[1]).find('p > a:nth-child(1)').text(),
                    vote: false,
                    reason: ""
                };
                articles.push(articleDetails);

                var newRow = jQuery('<tr></tr>');
                var newCol = jQuery('<td colspan="3" style="padding-bottom: 5px; font-family: sans-serif"></td>');
                var voteTrue = jQuery('<input type="radio" name="vote' + articles.length + '" value="true" checked="true">');
                var voteFalse = jQuery('<input type="radio" name="vote' + articles.length + '" value="false">');
                var reason = jQuery('<input type="text" style="width: 350px">');

                newRow.append(newCol);
                newCol.append(voteTrue);
                newCol.append(jQuery("<span>Yes</span>"));
                newCol.append(voteFalse);
                newCol.append(jQuery("<span>No </span>"));
                newCol.append(reason);

                voteTrue.change(function(element) {
                    articleDetails.vote = jQuery(this).is(":checked");
                });

                voteFalse.change(function(element) {
                    articleDetails.vote = !jQuery(this).is(":checked");
                });

                reason.keydown(function(element) {
                    articleDetails.reason = jQuery(this).val();
                });

                newRow.insertAfter(jQuery(row));

            }
        });

        var parentRows = articleTable.find('tbody')
        var submitRow = jQuery("<tr></tr>");
        var submitColumn = jQuery("<td colspan='3'></td>");
        var submit = jQuery("<button>Submit</button>");

        parentRows.append(submitRow);
        submitRow.append(submitColumn);
        submitColumn.append(submit);

        submit.click(function() {

            var message = "";

            for (var index = 0; index < articles.length; ++index) {
                var article = articles[index];

                message += article.title;
                message += "%0D%0A";
                if (article.vote) {
                    message += "I would click this article. ";
                } else {
                    message += "I would click this article. ";
                }
                message += article.reason;
                message += "%0D%0A%0D%0A";
            }

            window.open('mailto:ering@dzone.com?subject=Article%20Feedback&body=' + message);
        });
   // }, 5000);
});