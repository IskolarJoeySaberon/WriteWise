function generateKeywords() {
  const topic = document.getElementById('topicInput').value;
  const output = document.getElementById('keywordList');
  output.innerHTML = '';
  if (!topic) {
    output.innerHTML = '<li>Please enter a topic.</li>';
    return;
  }
  const suggestions = [
    `${topic} in modern education`,
    `Issues in ${topic}`,
    `Case study on ${topic}`,
    `${topic} research trends`,
    `Development of ${topic}-based solutions`
  ];
  suggestions.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    output.appendChild(li);
  });
}
