enquire.register("screen and (max-width: 768px)", {
    match : function() {
        $('html').addClass('device-phone');
    },

    unmatch : function() {
        $('html').removeClass('device-phone');
    },
});