var app = (function(app, $){

  currentScene = 0;
  currentSlide = 0;

  $cache = {
    scenes: $('.scene'),
    slides: $('.scene').eq(0).find('.slide')
  };

  function _constructor(){
    _bindEvents();
  }

  function _bindEvents(){
    $('body').swipe({
      swipe: function(event,direction) {
        if(direction == 'up') {
          slideHandle('down');
        } else if(direction == 'down') {
          slideHandle('up');
        }
      }
    });
    $('body, a, iframe').on('touchmove',function(e){
      e.stopPropagation();
      e.preventDefault();
    });
    $('a, iframe').on('mouseenter',function(e){
      e.stopPropagation();
      e.preventDefault();
    });
    $.browserSwipe({
      up: function(){
        slideHandle('up');
      },
      down: function(){
        slideHandle('down');
      }
    });
  }

  function slideHandle(direction) {
    switch(direction) {
      case 'up':
        if(currentSlide > 0) {
          currentSlide--;
          sceneHandle();
        } else {
          if(currentScene > 0) {
            currentScene--;
            currentSlide = 0;
            $cache.slides = $cache.scenes.eq(currentScene).find(".slide");
            sceneHandle();
          }
        }
      break;
      case 'down':
        if(currentSlide < ($cache.slides.length - 1)) {
          currentSlide++;
          sceneHandle();
        } else {
          if(currentScene < ($cache.scenes.length - 1)) {
            currentScene++;
            currentSlide = 0;
            $cache.slides = $cache.scenes.eq(currentScene).find(".slide");
            sceneHandle();
          }
        }
      break;
    }
  }

  function sceneHandle(){
    $cache.scenes.each(function(i){
      if($(this).index() == currentScene) {
        $(this).addClass('active').removeClass('after');
      } else if($(this).index() < currentScene){
        $(this).addClass('after').removeClass('active');
      } else {
        $(this).removeClass('after').removeClass('active');
      }
    });
    $cache.slides.each(function(i){
      if(i == currentSlide) {
        $(this).addClass('active').removeClass('after');
      } else if(i < currentSlide){
        $(this).addClass('after').removeClass('active');
      } else {
        $(this).removeClass('after').removeClass('active');
      }
    });
  }

  return _constructor;

})(window.app || {}, jQuery);

$(document).ready(function(){
  app();
});
