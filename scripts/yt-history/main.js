import { setInputsDisabled } from "./utils.js";

const panelStyleContent = /*css*/`
  :root {
    --panel-bg-color: #222940;
    --panel-border-color: #5e6366;
  }
  .ytcbk-panel {
    background: var(--panel-bg-color);
    border: 1px solid var(--panel-border-color);
    border-radius: 4px;    
    z-index: 1000;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem;
    color: white;
  }
  

  .ytbck-title { 
    font-size: 1rem; 
    margin: 0;
  }

  .ytbck-midsection {
    padding: .5rem 0;
  }

  .ytbck-search-field {
    display: flex;
    flex-flow: row nowrap;
  }

  #ytcbk-status-dot {
    width: 10px; 
    height: 10px; 
    border-radius: 50%; 
    background: green; 
    margin-right: .5rem
  }
`;

const inputIDs = ["ytcbk-search-input", "ytcbk-search-button"];

const handleSearch = (e) => {
  const inputVal = document.getElementById("ytcbk-search-input").value;
  if (inputVal.length < 1) {
    console.log("please enter a keyword");
    return;
  }
  setInputsDisabled(inputIDs, true);

  // start clickin on those x-es
};

const panelStruct = {
  tag: "div",
  class: "ytcbk-panel",
  children: {
    style: {
      tag: "style",
      textContent: panelStyleContent,
    },
    topPart: {
      tag: "div",
      // style: "border: 1px solid black;",
      children: {
        title: {
          tag: "h1",
          textContent: "YouTube Cleanse By Keyword",
          class: "ytbck-title",
        },
      },
    },
    midSection: {
      tag: "div",
      class: "ytbck-midsection",
      children: {
        searchField: {
          tag: "div",
          class: "ytbck-search-field",
          children: {
            searchInput: {
              tag: "input",
              placeholder: "comma-separated keywords",
              style: `
                width: 100%;
                min-width: 200px;
                margin-right: .5rem;
              `,
              id: "ytcbk-search-input",
            },
            searchSubmit: {
              tag: "button",
              textContent: "Cleanse",
              style: "",
              id: "ytcbk-search-button",
              bind: {
                on: "click",
                event: handleSearch,
              },
            },
          },
        },
        statusBar: {
          tag: "div",
          style: "display: flex; align-items: center; margin: .5rem 0",
          children: {
            statusDot: {
              tag: "div",
              disabled: "true",
              id: "ytcbk-status-dot",
            },
            statusText: {
              tag: "div",
              style: "font-size: 11px",
              textContent: "ready",
            },
          },
        },
      },
    },
  },
};

// reserved fields. the rest is spread to attributes.
const reservedKeys = ["tag", "children", "textContent", "bind"];
export const buildElement = (struct) => {
  // switch to typescript please
  if (!struct?.tag) {
    console.error("struct", struct, "has no tag");
    return null;
  }
  let el = document.createElement(struct.tag);

  // process textcontent
  if (Object.prototype.hasOwnProperty.call(struct, "textContent")) {
    el.textContent = struct.textContent;
  }

  // process children
  if (Object.prototype.hasOwnProperty.call(struct, "children")) {
    Object.entries(struct.children).forEach(([_name, _struct]) => {
      let _el = buildElement(_struct);
      _el.setAttribute("name", _name);
      el.appendChild(_el);
    });
  }

  // bind events
  if (Object.prototype.hasOwnProperty.call(struct, "bind")) {
    el.addEventListener(struct.bind.on, struct.bind.event);
  }

  // spreading other values as attributes
  Object.entries(struct)
    .filter(([key, _]) => !reservedKeys.includes(key))
    .forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  return el;
};

const panel = buildElement(panelStruct);
const waitForBuildCompletion = setInterval(() => {
  if (panel) {
    console.log("panel has done building!");
    document.body.appendChild(panel);
    clearInterval(waitForBuildCompletion);
  } else {
    console.log("building panel...");
  }
}, 20);

// Array.from(document.querySelectorAll("button")).filter(el => el.innerText === "Load more")

// Array.from(document.querySelectorAll("div")).filter(el => el.innerHTML === "Looks like you've reached the end")
