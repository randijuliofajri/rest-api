$('#search-button').click(function () {
    cari();
});

$('#search-input').keyup(function (e) {
    if (e.keyCode === 13) {
        cari();
    }
});

function cari() {
    $('#movie-list').html('');
    $.LoadingOverlay('show');
    $.ajax({
        url: 'http://www.omdbapi.com',
        type: 'get',
        dataType: 'json',
        data: {
            apikey: '3843e831',
            s: $('#search-input').val()
        },
        success: function (result) {
            if (result.Response == "True") {
                let movies = result.Search;
                console.log(movies);

                $.each(movies, function (i, data) {
                    if (data.Poster == 'N/A') {
                        hasil(i, data, data.Poster = 'img/default.png');
                    } else {
                        hasil(i, data);
                    }
                });
            } else {
                $('#movie-list').html(`
                <div data-aos="fade-up" class="col">
                    <h1>` + result.Error + `</h1>
                </div>
                `);
            }
            $.LoadingOverlay('hide');
        }

    })
}

function hasil(i, data) {
    $('#movie-list').append(`
                        <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-zoom-in" data-aos-delay="`+ i * 10 + `">
                        <div class="card">
                        <img class="card-img-top" src="`+ data.Poster + `" alt="Card image cap">
                        <div class="card-body">
                        <h5 class="card-title">`+ data.Title + `</h5>
                        <p class="card-text">`+ data.Year + `</p>
                        <button class="btn btn-primary see-detail" data-id="`+ data.imdbID + `">See Detail</button>
                        </div>
                        </div>
                        </div>
                    `);
}

$('#movie-list').on('click', '.see-detail', function () {
    $.LoadingOverlay('show');
    $.ajax({
        url: 'http://omdbapi.com',
        dataType: 'json',
        type: 'get',
        data: {
            apikey: '3843e831',
            i: $(this).data('id')
        },
        success: function (result) {
            if (result.Response === "True") {
                if(result.Poster == "N/A")
                {
                    seeDetail(result, result.Poster = 'img/default.png');
                }else{
                    seeDetail(result)
                }
                $.LoadingOverlay('hide');
                $('#modal').modal('show');
                
            }

        }
    })
});

function seeDetail(result) {
    $('h5.modal-title').html('Movie Detail: ' + result.Title);
    $('.modal-body').html(`
    <div class="container">
    <div class="row">
    <div class="col-4">
    <img src="`+ result.Poster + `" class="img-fluid" alt="` + result.Title + `">
    </div>
    <div class="col-8">
    <h3>`+ result.Title + ` (` + result.Year + `)</h3>
    <h6 class="card-subtitle mb-2 text-muted">`+ result.Rated + `  |  ` + result.Runtime + `  |  ` + result.Genre + `  |  ` + result.Released + `</h6>
    <p class="alert">`+ result.Plot + `</p>
    <p class="card-subtitle mb-2 text-muted">Director: `+ result.Director + `</p>
    <p class="card-subtitle mb-2 text-muted">Writer: `+ result.Writer + `</p>
    <p class="card-subtitle mb-2 text-muted">Actors: `+ result.Actors + `</p>
    </div>
    </div>
    </div>
    `);
}

