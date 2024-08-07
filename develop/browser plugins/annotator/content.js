console.log('Content script loaded');

function toggleSidebar() {
  console.log("Toggling sidebar");
  let sidebar = document.getElementById('annotationSidebar');
  if (sidebar) {
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
  } else {
    createSidebar();
  }
}

function createSidebar() {
  console.log("Creating sidebar");
  let sidebar = document.createElement('div');
  sidebar.id = 'annotationSidebar';
  sidebar.style.position = 'fixed';
  sidebar.style.top = '0';
  sidebar.style.right = '0';
  sidebar.style.width = '300px';
  sidebar.style.height = '100%';
  sidebar.style.zIndex = '1000';
  
  // Create shadow DOM
  let shadow = sidebar.attachShadow({ mode: 'open' });

  // Create container inside shadow DOM
  let container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.right = '0';
  container.style.width = '300px';
  container.style.height = '100%';
  container.style.backgroundColor = 'white';
  container.style.border = '1px solid #ccc';
  container.style.zIndex = '1000';
  container.style.overflowY = 'auto';
  container.style.padding = '10px';
  container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  container.style.opacity = '0.9'; // Added opacity
  shadow.appendChild(container);

  // Styles for the sidebar content
  let style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
    }
    body {
      font-family: Arial, sans-serif;
      color: #000;
    }
    .annotation-card {
      border: 1px solid #ccc;
      margin-bottom: 10px;
      border-radius: 4px;
      overflow: hidden;
    }
    .annotation-header {
      background-color: #f9f9f9;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .annotation-body {
      padding: 10px;
      display: block; /* Make sure the body is always visible */
    }
    .annotation-date {
      font-size: 0.8em;
      color: #666;
    }
    .delete-button {
      background: none;
      border: none;
      color: red;
      cursor: pointer;
    }
  `;
  shadow.appendChild(style);

  let title = document.createElement('h2');
  title.innerText = 'Annotations';
  container.appendChild(title);

  let textarea = document.createElement('textarea');
  textarea.id = 'annotationInput';
  textarea.rows = 4;
  textarea.style.width = '100%';
  container.appendChild(textarea);

  let addButton = document.createElement('button');
  addButton.innerText = 'Add Annotation';
  addButton.onclick = addAnnotation;
  container.appendChild(addButton);

  let annotationList = document.createElement('ul');
  annotationList.id = 'annotationList';
  container.appendChild(annotationList);

  document.body.appendChild(sidebar);

  loadAnnotations();
}

function addAnnotation() {
  let annotationInput = document.getElementById('annotationSidebar').shadowRoot.getElementById('annotationInput');
  let annotationText = annotationInput.value;
  if (annotationText) {
    let annotation = {
      id: Date.now(),
      text: annotationText,
      dateCreated: new Date().toLocaleString(),
      lastUpdated: new Date().toLocaleString(),
      sourcePage: window.location.href
    };

    let annotationList = document.getElementById('annotationSidebar').shadowRoot.getElementById('annotationList');
    let listItem = document.createElement('li');
    listItem.innerHTML = formatAnnotation(annotation);
    annotationList.appendChild(listItem);

    addDeleteEventListener(listItem, annotation.id);

    saveAnnotation(annotation);
    annotationInput.value = ''; // Clear the input field
  }
}

function saveAnnotation(annotation) {
  chrome.storage.local.get({ annotations: [] }, (result) => {
    let annotations = result.annotations;
    annotations.push(annotation);
    chrome.storage.local.set({ annotations: annotations });
  });
}

function loadAnnotations() {
  chrome.storage.local.get({ annotations: [] }, (result) => {
    let annotations = result.annotations;
    let annotationList = document.getElementById('annotationSidebar').shadowRoot.getElementById('annotationList');
    annotationList.innerHTML = '';
    annotations.forEach((annotation) => {
      let listItem = document.createElement('li');
      listItem.innerHTML = formatAnnotation(annotation);
      annotationList.appendChild(listItem);

      addDeleteEventListener(listItem, annotation.id);
    });
  });
}

function formatAnnotation(annotation) {
  return `
    <div class="annotation-card">
      <div class="annotation-header">
        <div class="annotation-date">${annotation.dateCreated}</div>
        ${annotation.text}
        <div class="annotation-date">Last Updated:${annotation.lastUpdated}</div>
        <a href="${annotation.sourcePage}" target="_blank">${annotation.sourcePage}</a></div>
        <button class="delete-button">Delete</button>
    </div>
  `;
}

function addDeleteEventListener(listItem, annotationId) {
  let shadowRoot = document.getElementById('annotationSidebar').shadowRoot;
  listItem.querySelector('.delete-button').addEventListener('click', () => {
    deleteAnnotation(annotationId);
  });
}

function deleteAnnotation(id) {
  chrome.storage.local.get({ annotations: [] }, (result) => {
    let annotations = result.annotations.filter(annotation => annotation.id !== id);
    chrome.storage.local.set({ annotations: annotations }, () => {
      loadAnnotations(); // Reload the annotations after deletion
    });
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  if (message.command === 'toggleSidebar') {
    toggleSidebar();
    sendResponse({ status: 'Sidebar toggled' });
  }
});
