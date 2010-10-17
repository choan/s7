(function() {

S7.SlideShow = function(context) {
  this.slides = [];
  this.callbacks = [];
};

S7.SlideShow.prototype.addSlide = function(id, element) {
  this.slides.push( new S7.Slide(id, element) );
};

S7.SlideShow.prototype.goTo = function(idOrIndexOrSlide) {
  var slide = idOrIndexOrSlide && typeof idOrIndexOrSlide == 'object' ? idOrIndexOrSlide : this.getSlide(idOrIndexOrSlide);
  var index;
  if (slide && this.currentSlide != slide) {
    if (this.currentSlide) {
      this.currentSlide.hide();
      index = this.getIndex(this.currentSlide);
      triggerCallbacks.call(this, 'slide.hidden', this.currentSlide, index);
    }
    slide.show();
    index = this.getIndex(slide);
    triggerCallbacks.call(this, 'slide.shown', slide, index);
    this.currentSlide = slide;
  }
};

S7.SlideShow.prototype.getSlide = function(idOrIndex) {
  var slide = null;
  var index = 0;
  if (typeof idOrIndex == 'number') {
    if (idOrIndex >= 0 && idOrIndex < this.slides.length) {
      slide = this.slides[idOrIndex];
    }
  }
  else {
    while (!slide && index < this.slides.length) {
      if (this.slides[index].id == idOrIndex) {
        slide = this.slides[index];
      }
      index += 1;
    }
  }
  return slide;
};

S7.SlideShow.prototype.goNext = function(delta) {
  var dest = this.getNext(delta);
  if (dest) {
    this.goTo(dest);
  }
};

S7.SlideShow.prototype.goPrev = function() {
  this.goNext(-1);
};

S7.SlideShow.prototype.getNext = function(delta) {
  delta = delta || 1;
  var index = 0;
  var nextIndex;
  while (index < this.slides.length) {
    if (this.slides[index] == this.currentSlide) {
      nextIndex = index + delta;
      if (nextIndex >= 0 && nextIndex < this.slides.length) {
        return this.slides[nextIndex];
      }
      else {
        return null;
      }
    }
    index += 1;
  }
};

S7.SlideShow.prototype.getPrevious = function() {
  return this.getNext(-1);
};

S7.SlideShow.prototype.registerCallback = function(fn) {
  this.callbacks.push(fn);
};

S7.SlideShow.prototype.getIndex = function(slide) {
  for (var i = 0; i < this.slides.length; i += 1) {
    if (slide == this.slides[i]) {
      return i;
    }
  }
};

S7.SlideShow.prototype.start = function() {
  this.goTo(0);
};


S7.Slide = function(id, element) {
  this.id = id;
  this.element = element;
};

S7.Slide.prototype.show = function() {
  this.element.style.display = 'block';
  this.element.className += ' currentSlide';
};


S7.Slide.prototype.hide = function() {
  this.element.style.display = 'none';
  this.element.className = this.element.className.replace(' currentSlide', '');
};

var triggerCallbacks = function() {
  for (var i = 0; i < this.callbacks.length; i += 1) {
    this.callbacks[i].apply(this, arguments);
  }
};

})();