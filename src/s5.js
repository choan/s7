(function() {

S7.S5 = function() {
  this.superclass.constructor.call(this);
  var allDivs = document.getElementsByTagName('div');
  for (var i = 0, j = 0, div; i < allDivs.length; i += 1) {
    div = allDivs[i];
    if (div.className.search(/(^|\s)slide(\s|$)/) != -1) {
      div.id = div.id || 'slide-' + j;
      div.style.display = 'none';
      this.addSlide(div.id, div);
      j += 1;
    }
  }
  initControls.call(this);
  this.start();
};

S7.utils.extend(S7.S5, S7.SlideShow);


function initControls() {
  var controls = getOrCreate('controls');
  var currentSlide = getOrCreate('current-slide', controls);
  currentSlide.innerHTML = "0/" + (this.slides.length - 1);
  var form = getOrCreate('control-form', controls, false, 'form');
  var select = getOrCreate('jumplist', form, false, 'select');
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
  var i, slide, title;
  for (i = 0; i < this.slides.length; i += 1) {
    slide = this.slides[i];
    title = slide.element.getElementsByTagName('h1')[0].innerHTML.replace(/<[^>]*>/g, '');
    select.appendChild(new Option(i + ': ' + title));
  }
  select.addEventListener('change', function(ss) {
    return function(e) {
      ss.goTo(this.selectedIndex);
    };
  }(this), false);

  this.registerCallback(function(type, slide, index) {
    if (type == 'slide.shown') {
      select.selectedIndex = index;
    }
  });

  this.registerCallback(function(type, slide, index) {
    if (type == 'slide.shown') {
      currentSlide.innerHTML = index + "/" + (this.slides.length - 1);
    }
  });

  document.addEventListener('keyup', getKeyupHandler(this), false);
  document.addEventListener('click', getClickHandler(this), false);
}

function isSelfOrDescendant(el, id) {
  var p = el;
  do {
    if (p.id == id) return true;
  } while (p = p.parentNode);
}

function getKeyupHandler(ss) {
  return function(e) {
    if (isSelfOrDescendant(e.target, 'controls')) return;
    switch (e.keyCode) {
      case 39: // right
      case 40: // down
      case 32: // spacebar
        ss.goNext();
        break;
      case 37: // left
      case 38: // up
        ss.goPrev();
        break;
    }
  };
}

function getClickHandler(ss) {
  return function(e) {
    if (e.target.tagName.toLowerCase() == 'a' || isSelfOrDescendant(e.target, 'controls')) {
      return;
    }
    ss.goNext();
  };
};


function getOrCreate(id, parent, prepend, tag) {
  prepend = prepend || false;
  parent = parent || document.body;
  tag = tag || 'div';
  var el = document.getElementById(id);
  if (!el) {
    el = document.createElement(tag);
    el.id = id;
    if (prepend) {
      parent.insertBefore(el, parent.firstChild);
    }
    else {
      parent.appendChild(el);
    }
  }
  return el;
}

})();