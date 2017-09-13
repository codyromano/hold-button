(() => {
  const timeouts = {};

  function delegate(eventType, selector, callback, root = document.body) {
    root.addEventListener(eventType, event => {
      if (event.target.matches(selector)) {
        callback(event.target);
      }
    });
  }

  const assignId = (function() {
    let id = 1;
    return (node) => {
      node.dataset.hbid = `hold-button-item-${id++}`;
      return node;
    };
  })();

  const hasId = function(node) {
    return typeof node.dataset.hbid === 'string';
  };

  const getId = function(node) {
    return node.dataset.hbid;
  };

  delegate('mouseup', '.hold-button', node => {
    const nodeId = getId(node);
    window.clearTimeout(timeouts[nodeId]);
    delete timeouts[nodeId];
  });

  delegate('mousedown', '.hold-button', node => {
    if (!hasId(node)) {
      assignId(node);
    }
    const customDuration = parseInt(node.dataset.duration);
    // Default to 2 seconds
    const duration = isNaN(customDuration) ? 2 : customDuration;
    node.querySelector('.bar').style.animationDuration = `${duration}s`;

    const nodeId = getId(node);

    timeouts[nodeId] = setTimeout(() => {
      // Remove all text other than the done text
      Array.from(node.querySelectorAll('span'))
        .filter(child => !child.classList.contains('hold-button-done'))
        .forEach(child => node.removeChild(child));

      node.classList.add('hold-button-confirmed');
      delete timeouts[nodeId];
    }, duration * 1000);
  });
})();