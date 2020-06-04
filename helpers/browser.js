const scroller = function(scope) {
  const body = document.body;
  const timerInterval = 1500;

  let current = 0;

  const scroll = () => {
    current = current + body.scrollHeight;
    window.scrollTo(0, current);
  };

  const infiniteScroller = {
    timer: null,
    stopped: false,

    start() {
      this.stopped = false;
      this.timer = setTimeout(() => {
        scroll();
        if (!this.stopped) this.start();
      }, timerInterval);
    },

    stop() {
      this.stopped = true;
      clearTimeout(this.timer);
      this.timer = null;
    }
  };

  scope.scroller = infiniteScroller;
};

module.exports = {
  scroller
};
