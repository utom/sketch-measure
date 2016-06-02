jQuery(
    function(){
        Spec(<!-- json -->)
            .artboardList(window.artboards || undefined)
            .sliceList(window.slices || undefined)
            .colorList(window.colors || undefined)
    }
);