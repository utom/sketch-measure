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
                    $('#submit').click();
                    return false;
                }
            });
});