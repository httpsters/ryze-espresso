$(document).ready(function() {
    $('#searchbox').select2({
        minimumInputLength: 3,
        placeholder: 'Search',
        ajax: {
            url: "http://api.soundcloud.com/tracks.json",
            dataType: 'jsonp',
            quietMillis: 100,
            data: function(term, page) {
                return {
                    q: term,
                    limit: 10,
                    client_id: "e886c21459d731e8ac7aeedcb3c3b4bb"
                };
            },
            results: function(data, page ) {
                console.log(data);
                return { results: data }
            }
        },
        formatResult: function(data) { 
            return "<div class='select2-user-result'><img style=\"height:50px;width50px\"src="+data.artwork_url+"/>" + data.title + "</div>"; 
        },
        formatSelection: function(data) { 
            console.log(data.permalink_url);
            // NASTY_NASTY_HACK.JPG
            // populate url field from search selection
            // for some reason need www
            var pu = data.permalink_url;
            if(pu) {
                var url = 'http://www.' + pu.substring(pu.indexOf("soundcloud"));
                console.log(url);
                var input = $('input[type=text].sc-url')
                input.val(url);
                 //trigger user "input" event so angular sees
                input.trigger('input');
            }
            return data.permalink_url; 
        },
        initSelection : function (element, callback) {
            var elementText = $(element).attr('data-init-text');
            callback({"term":elementText});
        }
    });
});