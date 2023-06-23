const styles = document.createElement("style");
styles.innerHTML = `
      :root {
        --panel-bg-color: rgba(255, 0, 0, 0);
        --panel-border-color: rgba(255, 255, 255, 0);
      }
      .yt-cleanser-panel {
        width: 500px;
        height: 300px;
        background: var(--panel-bg-color);
        border: 1px solid var(--panel-border-color);
        border-radius: 4px;    
        z-index: 10;
        position: absolute;
        top: 0px;
        left: 0px;
  
        padding: 1.5rem 1.5rem;
      }
  
    `;
const panel = document.createElement("div");
panel.classList.add("yt-cleanser-panel");

document.body.appendChild(panel);
