$(document).on("click", ".card", function(){
    $("#notes").empty();
    //capture article ID
    articleId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + articleId
    }).then(function(data){
        $("#notes").append("<h3 class='note-title'>Notes</h3><hr>");
        $("#notes").append("<p class='article-ref'>" + data.title + "</p>")
        $("#notes").append(`<input id="titleinput" class="form-control shadow" name="title" placeholder="Title">`);
        $("#notes").append(`<textarea id="bodyinput" class="form-control shadow" name="body" rows="5" placeholder="Message"></textarea>`);
        $("#notes").append("<button data-id='" + data._id + "' class='btn btn-dark' id='savenote' type='button'>Save</button>");

        if(data.note){
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#savenote", function(){
    var articleId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "articles/" + articleId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function(data){
        console.log(data);
        $('#notes').empty();
    })

    $("titleinput").val("");
    $("#bodyinput").val("");
});