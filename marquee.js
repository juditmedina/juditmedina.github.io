const acceleratableMarquee = (rootId) =>
  (function (copyRootId) {
    const $root = $(`#${copyRootId}`);
    const $track = $root.find(".track");
    let scrollOffset = 0;
    let trackPosition = 0;
    const textWidth = $root.find(".marquee-text").outerWidth();
    let prevScrollOffset = scrollOffset;
    let prevDistance = 0;
    let current = 0;
    let goal = 0;
    // this constant represents the distance at which the deceleration speed is about the same as the marquee's speed
    const decelerationThreshold = 16;

    const reset = () => {
      goal -= current;
      current = 0;
      trackPosition += textWidth;
    };

    const lerp = (distance) => {
      // we will lerp 5% of the distance between
      // the current position and the distance travelled by the scroll
      current += distance * 0.05;
      trackPosition = current;
    };

    const marquee = () => {
      trackPosition -= 1;
      goal = trackPosition;
      current = trackPosition;
    };

    function loop() {
      scrollOffset = window.pageYOffset || window.scrollTop;
      const scrollDiff = Math.abs(scrollOffset - prevScrollOffset) || 0;

      goal -= scrollDiff;
      const distance = goal - current;

      if (trackPosition <= textWidth * -1) {
        reset();
      }

      if (
        // when accelerating we want lerp
        prevDistance > distance ||
        // we want lerp when decelerating until a specific threshold
        (prevDistance < distance && distance <= -decelerationThreshold)
      ) {
        lerp(distance);
      } else {
        marquee();
      }

      prevScrollOffset = scrollOffset;
      prevDistance = distance;

      $track.css("transform", `translateX(${trackPosition}px)`);

      requestAnimationFrame(loop);
    }

    loop();
  })(rootId);

acceleratableMarquee("marquee-1");
acceleratableMarquee("marquee-2");
