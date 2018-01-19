var bttnAction = 'click';
if('ontouchend' in window) {
    bttnAction = 'touchend';
}

const videoController = function(action, parent) {
    action = (typeof action === 'undefined') ? null : action;
    parent = (typeof parent === 'undefined') ? 'body' : parent;

    if(action == 'pause'){
        $(parent).find('video').each(function(){
            $(this)[0].pause();
        });
    }
    else if(action == 'fullscreen-play'){
        $(parent).find('video').each(function(){
            if($(this)[0].webkitEnterFullScreen){
                $(this)[0].controls = false;    //remove controls if present

                let vid = $(this).attr('id');
                let activeVid = '#' + vid;

                //Create psuedo poster image for pause state
                $(window).load(function(){      //Action implemented after window load to ensure mobile Safari loads the correct offSet information
                    let vOffset = $(activeVid).position();

                    $(activeVid).parent().append('<div id="poster-' + vid +'"></div>'); //Ensure poster attaches to "real" video parent
                    $('#poster-' + vid).css({position: 'absolute', top: vOffset.top, left: vOffset.left, width: $(activeVid).width(), height: $(activeVid).height(), backgroundImage: 'url(' + $(activeVid).attr('poster') + ')', backgroundSize: '100%', display: 'none'});
                    $('#poster-' + vid).on(bttnAction, function(){
                        //Hide psuedo poster
                        $(this).css({display: 'none'});

                        $(activeVid)[0].webkitEnterFullScreen();
                        $(activeVid)[0].play();
                    });
                });

                //Activate video specific play button
                $('.play-bttn.' + vid).on(bttnAction, function(){
                    //Hide play button
                    $(this).removeClass('show');
                    $('#poster-' + vid + ':visible').css({display: 'none'});

                    $(activeVid)[0].webkitEnterFullScreen();
                    $(activeVid)[0].play();
                });

                //Activate play action for video
                $(this).on(bttnAction, function(){
                    //Hide play button
                    $('.' + vid).removeClass('show');
                    $('#poster-' + vid + ':visible').css({display: 'none'});

                    $(this)[0].webkitEnterFullScreen();
                    $(this)[0].play();
                });

                //Add listener for when fullscreen state changes - mobile webkit
                $(this)[0].addEventListener('webkitendfullscreen', function(){
                    $(this)[0].pause();
                    //Show play button
                    $('.' + vid).addClass('show');
                    $('#poster-' + vid).css({display: 'block'});
                });

                //Add listener for when fullscreen state changes - regular webkit
                $(this)[0].addEventListener('webkitfullscreenchange', function(){
                    if(!document.webkitFullscreenElement){
                        $(this)[0].pause();
                        //Show play button
                        $('.' + vid).addClass('show');
                        $('#poster-' + vid).css({display: 'block'});
                    }
                });
            }
        });
    }
};
