var I18N = {},
	lang = navigator.language.toLocaleLowerCase(),
	_ = function(str){
        return (I18N[lang] && I18N[lang][str])? I18N[lang][str]: str;
    }

$(function() {
    $(document).on('contextmenu', function(event){
        return false;
    })
});