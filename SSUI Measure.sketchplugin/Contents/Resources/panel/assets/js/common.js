var I18N = {},
	lang = navigator.language.toLocaleLowerCase(),
	_ = function(str){
        return (I18N[lang] && I18N[lang][str])? I18N[lang][str]: str;
    }

$(function() {
    $(document)
        .on('contextmenu', function(event){
                return false;
            })
        .keypress(function(event){
                var eventObj = event || e,
                    keyCode = eventObj.keyCode || eventObj.which;

                if(keyCode == 13){
                    event.stopPropagation();
                    $('#submit:not(:disabled)').click();
                    return false;
                }
            });
});

function lookupItemInput(x, y){
    var elem = document.elementFromPoint(x, y);
    $(elem).click();
}

window.onfocus = function(){
    SMAction('focus');
};

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-81011936-2');
ga('send', 'pageview');
