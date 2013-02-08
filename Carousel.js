//  HTML tag for this widgets shoud be like this
//  <div class="carousel">
//      <div class="content-conveyor">
//          <div class="slidercontent">
//              <div class="item"></div>
//              <div class="item"></div>
//              <div class="item"></div>
//              <div class="item"></div>
//              <div class="item"></div>
//          </div>
//      </div>
//  </div>

(function ($) {
    //var RQStyle = RadiantQ.Gantt.DefaultStyles;
    $.widget("radiantq.carousel", {
        currentUniqueRowSuffix: 0,
        options: {
            previous: null,
            next: null,
            speed: 20,
            mouseWheel: false,
            scroll: 1,
            auto:null
        },
        _create: function () {
            
            //declarations
            var left = 0;
            $(this.element).data("carousel");
            var $conveyor = $(".content-conveyor",this.element);
            var $item = $(".item",this.element);
            var $scrollSlider = $(".sliderContent", this.element);
            var $prev = $(this.options.Previous),
            $next = $(this.options.next),
            $speed = this.options.speed,
            $mouseWheel = this.options.mouseWheel,
            $scroll = this.options.scroll,
            $auto = this.options.auto;

            //assign the width to the slider
            var width = $item.outerWidth(true);
            var $sliderWidth=$item.length * width;
            $conveyor.width($sliderWidth);
            $scrollSlider.width($(window).width() - 190/*$next width+margin*/);

            //adding theme classes
            $scrollSlider.addClass("ui-widget-header");
            $item.addClass("ui-state-default");
            $prev.addClass("ui-state-default");
            $next.addClass("ui-state-default");

            //hiding the previous and next buttons when mouse hover
            $scrollSlider.mouseenter(function () {
                $prev.fadeOut();
                $next.fadeOut();
            }).mouseleave(function () {
                $prev.fadeIn();
                $next.fadeIn();
            });

            //disabling pervious and next button
            left = $scrollSlider.scrollLeft();
            if (left == 0) {
                $prev.attr({ disabled: 'disabled' });
                $prev.attr({ title: '' });
                $prev.css('opacity', 0.3);
            }
            else if (left == ($conveyor.width() - $scrollSlider.width() - 1)) {
                $next.attr({ disabled: 'disabled' });
                $next.attr({ title: '' });
                $next.css('opacity', 0.3);
            }            
            
            //click event for previous button to scroll right
            if ($prev)
                $($prev).mousedown(startPrevScrolling).mouseup(stopScrolling);
                $prev.bind("touchstart click", function () {
                    $next.removeAttr("disabled").css('opacity', "");
                    $next.attr({ title: 'Next' });
                    left = $scrollSlider.scrollLeft();
                    if (left != 0) {
                        $scrollSlider.animate({ scrollLeft: left - width }, $speed);
                    }
                    if (left == 0) {
                        $prev.attr({ disabled: 'disabled' });
                        $prev.attr({ title: '' });
                        $prev.css('opacity', 0.3);
                    }
                });

            //click event for next button to scroll left
            if ($next) {
                $($next).mousedown(startNextScrolling).mouseup(stopScrolling);
                $($next).bind("touchstart click", function () {
                    $prev.removeAttr("disabled").css('opacity', "");
                    $prev.attr({ title: 'Previous' });
                    left = $scrollSlider.scrollLeft();
                    if (left <= ($item.length * width-10)) {
                        $scrollSlider.animate({ scrollLeft: left + width }, $speed);
                    }
                    if (left == ($conveyor.width() - $scrollSlider.width()-1)) {
                        $next.attr({ disabled: 'disabled' });
                        $next.attr({ title: '' });
                        $next.css('opacity', 0.3);
                        $(this).removeClass("ui-state-hover");
                        $(this).addClass("ui-state-default");
                    }
                });
            }  
           

            //mousewhell scroll event
            if ($mouseWheel) {
                $scrollSlider.bind("mousewheel", function (event, delta) {
                    left = $scrollSlider.scrollLeft();
                    if (delta == '-1') {
                        if (left <= ($item.length * width)) {
                            $scrollSlider.animate({ scrollLeft: left + width }, $speed);
                        }
                    }
                    else {
                        if (left != 0) {
                            $scrollSlider.animate({ scrollLeft: left - width }, $speed);
                        }
                    }
                });
            }

            //auto scrolling effect
            if ($auto) {
                setInterval(function () {                    
                    var pos = $scrollSlider.scrollLeft();
                    if (pos != ($conveyor.width() - $scrollSlider.width()-1))
                        $scrollSlider.scrollLeft(pos + $speed);
                    //else
                    //    $scrollSlider.animate({ scrollLeft: 0 }, 1000);
                }, $auto);
            }

            //hovering(mouseenter and mouseleave) events for previous ,next and items.
            if ($prev)
            $prev.mouseenter(function () {
                HighlightButtons($prev);
            }).mouseleave(function () {
                HighlightsRemove($prev);
            });

            if ($next)
            $next.mouseenter(function () {
                HighlightButtons($next);
            }).mouseleave(function () {
                HighlightsRemove($next);
            });

            $item.mouseenter(function () {
                $(this).removeClass("ui-state-default");
                $(this).addClass("ui-state-hover");
            }).mouseleave(function () {
                $(this).removeClass("ui-state-hover");
                $(this).addClass("ui-state-default");
            });            

            //to assign the Scroll value to the carousel slider
            this.setScrollLeft = function (value) {
                $scrollSlider.scrollLeft(value);
                if (value == 0) {
                    $prev.attr({ disabled: 'disabled' });
                    $prev.attr({ title: '' });
                    $prev.css('opacity', 0.3);
                }
                else {
                    $prev.removeAttr("disabled").css('opacity', "");
                    $prev.attr({ title: 'Previous' });
                }
            }
            
            //Select the theme name send to URI
           // $item.bind("touchstart click", function () {
           //     var selectedValue = this.id;
            //    navigateToNewPagewith('theme' + '=' + selectedValue + '', left);
           // });

            //Add the theme name and scroll value to the URI and refresh the page
           // function navigateToNewPagewith(newParam, current) {
           //     var val = window.location.href.indexOf('?');
           //     var index = val == -1 ? window.location.href.length : val;
           //     var href = window.location.href.substring(0, index);
           //     window.location.replace(href + '?' + newParam + '+' + current);
           // }

            function startPrevScrolling() {
                // start increasing scroll position in Prevois position
                left = $scrollSlider.scrollLeft();
                if (left != 0) {
                    $scrollSlider.animate({ scrollLeft: left - width }, $speed, startPrevScrolling);
                }
            }

            function startNextScrolling() {
                // start increasing scroll position in Next position
                left = $scrollSlider.scrollLeft();
                if (left <= ($item.length * width)) {
                    $scrollSlider.animate({ scrollLeft: left + width }, $speed, startNextScrolling);
                }
            }

            function stopScrolling() {
                // stop increasing scroll position
                $scrollSlider.stop();
            }
            function HighlightButtons($buttons) {
                $($buttons).removeClass("ui-state-default");
                $($buttons).addClass("ui-state-hover");
            }
            function HighlightsRemove($buttons) {
                $($buttons).removeClass("ui-state-hover");
                $($buttons).addClass("ui-state-default");
            }
        },
        
    });
})(jQuery);
