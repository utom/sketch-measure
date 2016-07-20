var I18N = {};
var lang = navigator.language;
var _ = function(str){
        return (I18N[lang] && I18N[lang][str])? I18N[lang][str]: str;
    }

$(function() {
    $(document).on('contextmenu', function(event){
        return false;
    })
});