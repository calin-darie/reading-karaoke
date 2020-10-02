function splitSyllables(word) {
  let withSplitMarks = word.replace(/(?<=[^bcdfghjklmnpqrsștțvwxz])([bcdfghjklmnpqrsștțvwxz]+)(?=[^bcdfghjklmnpqrsștțvwxzi]|i.+$)/gi, function(consonants) {
    if (consonants.length === 1)
      return '`' + consonants;
    if (consonants.length === 2 && 
      'bpcgdtfvh'.includes(consonants[0].toLowerCase()) && 
      'lr'.includes(consonants[1].toLowerCase()))
      return '`' + consonants;
    if (consonants.length > 2 && 
      'mn'.includes(consonants[0].toLowerCase()) && 
      'bpcgdtfvh'.includes(consonants[1].toLowerCase()) && 
      !'lr'.includes(consonants[2].toLowerCase()))
      return consonants.substring(0, 2) + '`' + consonants.substring(2);
    return consonants[0] + 
      '`' + 
      consonants.substring(1);
  });
  withSplitMarks = withSplitMarks.replace(/aa|ae|ao|aă|aâ|aî|eo|eî|eâ|eă|oe|oă|oî|oâ|ăa|ăe|ouă|iuă|eia|(?<=^)ai(?=.+$)/gi, match => 
    match[0] + '`' + match.substring(1));
  return withSplitMarks.split('`');
};

(function () {
  const allElements = document.querySelectorAll('*');
  allElements.forEach(
    function(element) {
      if (element.nodeName === 'STYLE' || element.nodeName === 'SCRIPT') return;
      element.childNodes.forEach(
        function(child) {
          if (child.nodeName === '#text') {
            const text = child.nodeValue.trim();
            if (!text) return;
            var split = text.replace(/[\wăîâșț]+(-((un|o|l|o|i|mi|ți|am|ai|au|ați|a|n|al|ai|ale)\b))?(-[\wăîâșț]+)?/gi, function(word) {
              const syllables = splitSyllables(word);
              return `<span class='word'>${
                syllables.map(s => `<span class="syllable">${s}</span>`).join('')
              }</span>`;
            });
            var replacementNode = document.createElement('span');
            replacementNode.innerHTML = split;
            replacementNode.classList.add('text');
            element.insertBefore(replacementNode, child);
            element.removeChild(child);
          }
        });
    }
  );
})();
let previousHighlight = undefined;

function getLineHeight(element) {
  var lineHeightStyle = window.getComputedStyle(element)['line-height'];
  if (!lineHeightStyle.endsWith('px')) return 20;
  return Number.parseFloat(lineHeightStyle.substring(0, lineHeightStyle.length -1 - 'px'.length));
}

function highlightSyllableTouch(event) {
  highlightSyllable(event.touches[0], 2);
}

function highlightSyllable(event,lineHeightFactor = 0.8) {
  let x = event.clientX;
  let y = event.clientY;
  let lineHeight = getLineHeight(event.target);
  let contentPointedAtY = y - (lineHeightFactor * lineHeight);
  if (contentPointedAtY < 0) return;
  const element = document.elementFromPoint(x, contentPointedAtY);
  if (element.nodeName !== 'SPAN' || element.classList.contains('text')) return;
  if (previousHighlight) {
      previousHighlight.classList.remove('highlight');
  }
  element.classList.add('highlight');
  previousHighlight = element;
}

document.body.addEventListener('mousemove', highlightSyllable);
document.body.addEventListener('touchmove', highlightSyllableTouch);