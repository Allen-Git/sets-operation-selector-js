/**
 * Copyright (C) 2018, Allen Wu ( jiaming0507@gmail.com )
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions: 
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software. 
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL 
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE. 
 */
;(function ( $ ) {
  
    function SetSelector(element, radius, labels, areaClicked) {
      this.debug = false;
      this.radius = radius;
      this.element = element[0];
      this.ctx = element[0].getContext("2d");
      this.$element = $(element)
      this.selectedArea = [];

      this.$element.bind("click", $.proxy(this.handleClick, this));

      if (areaClicked) {
          this.$element.bind('areaClicked.ss', areaClicked);
      }

      this.init(element, radius, labels);
    }

    SetSelector.prototype.init = function(element, radius, labels) {
      var width = radius / 2;
      var height = Math.sqrt(radius ** 2 - width ** 2);

      this.baseCirclePoint = {
          x: 120,
          y: 75,
          v: labels[0],
          color: '#FEF9E7'
        };
      this.leftCirclePoint = {
          x: this.baseCirclePoint.x - width,
          y: this.baseCirclePoint.y + height,
          v: labels[1],
          color: '#E8DAEF'
        };
      this.rightCirclePoint = {
          x: this.baseCirclePoint.x + width,
          y: this.baseCirclePoint.y + height,
          v: labels[2],
          color: '#FDEDEC'
        };
      this.draw();
    };

    SetSelector.prototype.getCursorPosition = function(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        return {x: x, y: y};
    };

    SetSelector.prototype.isSelectCircle = function(circle, point) {
      if (this.debug) {
        var ctx = this.ctx;
        ctx.globalCompositeOperation='source-over';
        ctx.beginPath();
        ctx.moveTo(point.x, point.y)
        ctx.lineTo(circle.x, circle.y)
        ctx.stroke();
      }
      if (Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < this.radius) {
        return circle.v;
      }
      return '';
    };

    SetSelector.prototype.arc = function(point, fromAngle, toAngle) {
      this.ctx.arc(point.x, point.y, this.radius, fromAngle * Math.PI, toAngle * Math.PI);
    };

    SetSelector.prototype.moveTo = function(point) {
      this.ctx.moveTo(point.x, point.y);
    };

    SetSelector.prototype.draw = function(areas = [0]) {
      var ctx = this.ctx;
      ctx.clearRect(0, 0, this.element.width, this.element.height);

      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(this.baseCirclePoint.v, this.baseCirclePoint.x, this.baseCirclePoint.y - 20);
      ctx.fillText(this.leftCirclePoint.v, this.leftCirclePoint.x - 20, this.leftCirclePoint.y + 20);
      ctx.fillText(this.rightCirclePoint.v, this.rightCirclePoint.x + 20, this.rightCirclePoint.y + 20);

      ctx.beginPath();
      this.arc(this.baseCirclePoint, 0.5 * 2/3, 0.5 * 2/3 * 2);
      this.arc(this.rightCirclePoint, 1, 1 + 0.5 * 2/3);
      this.arc(this.leftCirclePoint, 1.5 + 0.5 * 1/3, 2);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'white'
      areas.forEach(area => {
        if (area == (this.baseCirclePoint.v + this.leftCirclePoint.v + this.rightCirclePoint.v)) {
          ctx.fillStyle = 'red'
        }
      });
      ctx.fill()

      ctx.globalCompositeOperation='destination-over';
      ctx.beginPath();
      this.arc(this.rightCirclePoint, 1 + 0.5 * 2/3, 1 + 0.5 * 2/3 * 2);
      this.arc(this.baseCirclePoint, 0, 0.5 * 2/3);
      this.moveTo(this.baseCirclePoint);
      this.arc(this.leftCirclePoint, 1.5 + 0.5 * 1/3, 2);
      ctx.stroke();
      ctx.fillStyle = 'white'
      areas.forEach(area => {
        if (area == (this.baseCirclePoint.v + this.rightCirclePoint.v)) {
          ctx.fillStyle = 'blue'
        }
      });
      ctx.fill()

      ctx.beginPath();
      this.arc(this.baseCirclePoint, 0.5 + 0.5 * 1/3, 1);
      this.arc(this.leftCirclePoint, 1 + 0.5 * 2/3, 1 + 0.5 * 2/3 * 2);
      this.moveTo(this.leftCirclePoint);
      this.arc(this.rightCirclePoint, 1, 1 + 0.5 * 2/3);
      ctx.stroke();
      ctx.fillStyle = 'white'
      areas.forEach(area => {
        if (area == (this.baseCirclePoint.v + this.leftCirclePoint.v)) {
          ctx.fillStyle = 'green'
        }
      });
      ctx.fill()

      ctx.beginPath();
      this.arc(this.leftCirclePoint, 0, 0.5 * 2/3);
      this.arc(this.rightCirclePoint, 0.5 + 0.5 * 1/3, 1);
      this.moveTo(this.rightCirclePoint);
      this.arc(this.baseCirclePoint, 0.5 * 2/3, 0.5 + 0.5 * 1/3);
      ctx.stroke();
      ctx.fillStyle = 'white'
      areas.forEach(area => {
        if (area == (this.leftCirclePoint.v + this.rightCirclePoint.v)) {
          ctx.fillStyle = 'yellow'
        }
      });
      ctx.fill()
      
      this.fillOnlyRemainCircle(this.baseCirclePoint, areas)
      this.fillOnlyRemainCircle(this.rightCirclePoint, areas)
      this.fillOnlyRemainCircle(this.leftCirclePoint, areas)
    };

    SetSelector.prototype.fillOnlyRemainCircle = function(circle, areas) {
      var ctx = this.ctx;
      ctx.beginPath();
      this.arc(circle, 0, 2);
      ctx.stroke();
      ctx.fillStyle = 'white'
      areas.forEach(area => {
        if (area == circle.v) {
          ctx.fillStyle = circle.color
        }
      });
      ctx.fill();
    };

    SetSelector.prototype.handleClick = function(e) {
        var selectedArea = this.selectedArea;
        var point = this.getCursorPosition(this.element, e);
        var val = '';
        val += this.isSelectCircle(this.baseCirclePoint, point);
        val += this.isSelectCircle(this.leftCirclePoint, point);
        val += this.isSelectCircle(this.rightCirclePoint, point);
        var idx = selectedArea.indexOf(val);
        if (idx == -1) {
          selectedArea.push(val);
        } else {
          selectedArea.splice(idx, 1);
        }
        this.draw(selectedArea);
        this.$element.trigger('areaClicked.ss', {selectedArea: selectedArea});
    };

    // Create the defaults once
    var pluginName = 'setselector',
        defaults = {
            radius: 50,
            labels: ['X', 'Y', 'Z']
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {
        var radius = this.options['radius'];
        var labels = this.options['labels'];
        var selector = new SetSelector(this.element, radius, labels, this.options['areaClicked']);
        this.selector = selector;

        selector.draw();
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        new Plugin( this, options );
    }

})( jQuery );