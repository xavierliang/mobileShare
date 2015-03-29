var app = (function(app, $){

  currentScene = 0;
  currentSlide = 0;
  currentFragment = -1;
  timeouts = [];

  $cache = {
    scenes: $('.scene'),
    slides: $('.scene').eq(0).find('.slide'),
    fragments: $('.slide').eq(0).find('.fragment')
  };

  function _constructor(){
    _bindEvents();
  }

  function _bindEvents(){
    $('body').swipe({
      swipe: function(event,direction) {
        if(direction == 'up') {
          fragmentHandle('down');
        } else if(direction == 'down') {
          fragmentHandle('up');
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
        fragmentHandle('up');
      },
      down: function(){
        fragmentHandle('down');
      }
    });
  }

  function autoIncreaseFragment() {
    currentFragment++;
    sceneHandle();
  }

  function autoFragmentHandle() {
    var t = 0;
    for (var i=currentFragment+1; i<$cache.fragments.length; i++){
      var auto = $cache.fragments.eq(i).data('auto');
      if (auto === 0 || auto===undefined) {
        break;
      }
      t = t + auto;
      timeouts.push(setTimeout(autoIncreaseFragment, t));
    }
  }

  function fragmentHandle(direction) {
    for (var i=0;i<timeouts.length;i++){
      clearTimeout(this);
    }
    timeouts=[];
    switch(direction) {
      case 'up':
        if(currentFragment >= 0) {
          console.log(currentFragment);
          currentFragment--;
          sceneHandle();
        } else {
          slideHandle(direction);
        }
      break;
      case 'down':
        if(currentFragment < ($cache.fragments.length-1)){
          currentFragment++;
          sceneHandle();
        } else {
          slideHandle(direction);
        }
        autoFragmentHandle();
      break;
    }
  }


  function slideHandle(direction) {
    switch(direction) {
      case 'up':
        $cache.fragments.removeClass('active');
        if(currentSlide > 0) {
          currentSlide--;
          currentFragment = -1;
          $cache.fragments = $cache.slides.eq(currentSlide).find('.fragment');
          sceneHandle();
        } else {
          if(currentScene > 0) {
            currentScene--;
            currentSlide = 0;
            currentFragment = -1;
            $cache.slides = $cache.scenes.eq(currentScene).find(".slide");
            $cache.fragments = $cache.slides.eq(0).find('.fragment');
            sceneHandle();
          }
        }
      break;
      case 'down':
        $cache.fragments.removeClass('active');
        if(currentSlide < ($cache.slides.length - 1)) {
          currentSlide++;
          currentFragment = -1;
          $cache.fragments = $cache.slides.eq(currentSlide).find('.fragment');
          sceneHandle();
        } else {
          if(currentScene < ($cache.scenes.length - 1)) {
            currentScene++;
            currentSlide = 0;
            currentFragment = -1;
            $cache.slides = $cache.scenes.eq(currentScene).find(".slide");
            $cache.fragments = $cache.slides.eq(0).find('.fragment');
            sceneHandle();
          }
        }
      break;
    }
  }

  function sceneHandle(){
    $cache.scenes.each(function(i){
      if(i == currentScene) {
        $(this).addClass('active').removeClass('after');
      } else if(i < currentScene){
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
    var clearLev = $cache.fragments.eq(currentFragment).data('clear');
    $cache.fragments.each(function(i){
      if(i == currentFragment) {
        $(this).addClass('active').removeClass('after');
      } else if(i > currentFragment) {
        $(this).removeClass('after').removeClass('active');
      } else if(clearLev !== undefined) {
        if($(this).data('exempt') === undefined) {
          $(this).removeClass('active').addClass('after');
        } else if($(this).data('exempt') < clearLev) {
          $(this).removeClass('active').addClass('after');
        }
      }
    });
  }

  return _constructor;

})(window.app || {}, jQuery);

/*
$((function(){
  app();
});
*/
window.onload = function() {
  window.scrollTo(0,0);
  app();
};
