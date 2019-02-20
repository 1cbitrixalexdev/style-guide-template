const $main = $('main'),
    $aside = $('aside');

$(() => {
    // Show tooltips on titles width data-toggles
    $('[data-toggle="tooltip"]').tooltip();

    $('[data-toggle="popover"]').popover();

});

// All functions after page loaded
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $aside.toggleClass('active');
        $(this).find('span').toggleClass('fa-times-circle fa-align-left');
        $(this).find('span').toggleClass('far fas');
    });
    // scroll to top
    $(() => {
        const toTop = $('#toTop');
        if (toTop.length) {
            const scrollTrigger = 100, // px
                backToTop = function () {
                    let scrollTop = $(window).scrollTop();
                    if (scrollTop > scrollTrigger) {
                        toTop.show();
                    } else {
                        toTop.hide();
                    }
                };
            backToTop();
            $(window).on('scroll', function () {
                backToTop();
            });
            toTop.on('click', function (e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: 0
                }, 800);
            });
        }
    });

    // Put the styles link to head
    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'css/styles.css') );
    // signalize this script is loaded
    console.log("Helper done...");
});
