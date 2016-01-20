/**
 * @class    Tooltip
 * @author   Ariel Saldana / http://ahhriel.com
 * @info     Component for sliders
 */
P.Components.Slider = P.Core.Abstract.extend({
    options: {
        automatic : false,
        autoSlideSpeed : 5000
    },
    slide : 0,
    maxSlides : 0,
    $slide : null,
    working : false,
    lock : false,
    element : null,

    /**
     * Initialise and merge options
     * @constructor
     * @param {object} options Properties to merge with defaults
     */
    construct: function(elem, options) {
        this._super(options);
        this.ticker = new P.Tools.Ticker();
        this.detector = new P.Tools.Detector();
        
        this.element = elem;
        
        if (this.options.automatic) {
            this.initAutomaticPlayback();
            this.removeButtons();
        }
        
        else {
        
            if ( this.detector.system.ios || 
            this.detector.system.android || 
            this.detector.system.windows_mobile ||
            this.detector.system.blackberry ) {
                this.initMobilePan();
                this.removeButtons();
            }
            else {
                this.initNav();
            }
        }

        
        this.initElementClass();
        
    },
    
    initElementClass : function(){
        var that = this;
        
        that.$slide = $(that.element + ' li');
        
        $(that.element + ' li').each(function(i){
            if (i != 0)
            $(this).addClass('inactive')
            else
            $(this).addClass('active');
            that.maxSlides = i;
        });
        
        that.slide = 1;
    },
    
    removeButtons : function() {
         $(this.element + ' #next').remove();
         $(this.element + ' #back').remove();
    },
    
    initAutomaticPlayback : function(){
        var that = this;
       that.ticker.on( 'tick-'+that.options.autoSlideSpeed, function (infos){
           that.goToImage('left');
        // console.log(infos.elapsed);
        // that.working = false;
        // that.ticker.off('tick-1500');
        })
    },
    
    initMobilePan : function(){
        var that = this;
        var mc = new Hammer($(that.element)[0]);
        
        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        
        mc.on("panleft panright", function(ev) {
            
        console.log(ev.type);
        
        
        this.lock = true;
        if (ev.type == 'panleft')
        {
            that.goToImage('left');
        }
        else if (ev.type == 'panright')
        {
            that.goToImage('right');
        }
        });
        
        console.log(mc);
    },
    
    initNav : function(){
        var that = this;
        $(that.element + ' #next').bind("click", function(i){
            console.log('yep');
            that.goToImage('left');
        });
    
        $(that.element + ' #back').bind("click", function(i){
            that.goToImage('right');
        });
    },
    
    goToImage : function(direction){
        var that = this;
        
        if (that.working)
        return;
        
        that.working = true;
        
        if (direction === 'left')
        {
        if (that.slide <= that.maxSlides)
        {
            that.$slide.eq(that.slide-1).removeClass('active').addClass('inactive');
            that.$slide.eq(that.slide).removeClass('inactive').addClass('active');
            that.slide += 1;
        }
        
        else 
        {
            that.$slide.eq(that.slide-1).removeClass('active').addClass('inactive');
            that.$slide.eq(0).removeClass('inactive').addClass('active');
            that.slide = 1;
        }
        }
        
        else if (direction === 'right')
        {
        if (that.slide > 1)
        {
            that.$slide.eq(that.slide-1).removeClass('active').addClass('inactive');
            that.$slide.eq(that.slide-2).removeClass('inactive').addClass('active');
            that.slide -= 1;
        }
        
        }
        that.ticker.on( 'tick-1500', function (infos){
        console.log(infos.elapsed);
        that.working = false;
        that.ticker.off('tick-1500');
        })
     }
  
});
