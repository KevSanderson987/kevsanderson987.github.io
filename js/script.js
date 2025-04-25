
const rerender = () => {
    $('body').localize();
    $('title').text($.t('title'))
}

$(function () {
    i18next
        .use(i18nextBrowserLanguageDetector)
        .use(i18nextHttpBackend)
        .init({
            debug: true,
            fallbackLng: 'en'
        }, (err, t) => {
            if (err) return console.error(err);
            jqueryI18next.init(i18next, $, { useOptionsAttr: true });
        });
});

$( document ).ready(function() {
    console.log( "ready!" );
    const params = new Proxy(new URLSearchParams(window.location.search),  {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let value = params.lang; // "some_value"
    var userLang;
    if (value != null) {
        userLang = value;
    } else {
        userLang = navigator.language || navigator.userLanguage;
    }
    i18next.changeLanguage(userLang, () => {
        rerender();
    });
});