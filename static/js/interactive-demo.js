// Interactive Demo Component for AHAT Project Page

let demoData = [];
let visualizationData = [];
let basePath = "";

// Load demo data from JSON file
async function loadDemoData() {
  try {
    // Get the base path from the current script location
    const scripts = document.getElementsByTagName("script");
    for (let script of scripts) {
      if (script.src && script.src.includes("interactive-demo.js")) {
        basePath = script.src.replace("js/interactive-demo.js", "");
        break;
      }
    }

    // Explicitly loading both data.json and visualization_data.json
    const [response1, response2] = await Promise.all([
      fetch(basePath + "demos/data.json"),
      fetch(basePath + "demos/visualization_data.json"),
    ]);

    if (!response1.ok) {
      throw new Error(
        `HTTP error fetching data.json! status: ${response1.status}`,
      );
    }
    if (!response2.ok) {
      console.warn(
        `HTTP error fetching visualization_data.json! status: ${response2.status}. Falling back to data.json for Demo 2.`,
      );
      // If it fails, we fall back to empty to handle it gracefully below.
    }

    demoData = await response1.json();

    if (response2.ok) {
      visualizationData = await response2.json();
    } else {
      visualizationData = demoData; // fallback
    }

    console.log("Demo data loaded successfully");
    initializeDemo1();
    initializeDemo2();
  } catch (error) {
    console.error("Error loading demo data:", error);
  }
}

// ========== Demo 1: Scene Graph Selection (No Video) ==========

// Initialize Demo 1
function initializeDemo1() {
  const sceneGraphSelect = document.getElementById("scene-graph-select-1");
  const instructionSelect = document.getElementById("instruction-select-1");

  if (!sceneGraphSelect || !instructionSelect) {
    console.error("Demo 1 select elements not found");
    return;
  }

  // Clear and populate scene graph dropdown
  sceneGraphSelect.innerHTML =
    '<option value="">-- Select Scene Graph --</option>';

  demoData.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = item.scene_graph_name;
    sceneGraphSelect.appendChild(option);
  });

  // Initialize scene graph panel state
  clearSceneGraphPanel1();

  // Add event listeners
  sceneGraphSelect.addEventListener("change", onSceneGraphChange1);
  instructionSelect.addEventListener("change", onInstructionChange1);
}

// Handle scene graph selection change for Demo 1
function onSceneGraphChange1() {
  const sceneGraphSelect = document.getElementById("scene-graph-select-1");
  const instructionSelect = document.getElementById("instruction-select-1");
  const selectedIndex = sceneGraphSelect.value;

  // Reset instruction dropdown
  instructionSelect.innerHTML =
    '<option value="">-- Select Instruction --</option>';

  // Clear output
  clearDemoOutput1();

  if (selectedIndex === "") {
    instructionSelect.disabled = true;
    clearSceneGraphPanel1();
    return;
  }

  // Populate instruction dropdown based on selected scene graph
  const sceneGraphData = demoData[selectedIndex];
  sceneGraphData.data_items.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = item.instruction;
    instructionSelect.appendChild(option);
  });

  instructionSelect.disabled = false;

  // Update scene graph panel
  renderSceneGraphPanel1(sceneGraphData.scene_graph);
}

// Handle instruction selection change for Demo 1
function onInstructionChange1() {
  const sceneGraphSelect = document.getElementById("scene-graph-select-1");
  const instructionSelect = document.getElementById("instruction-select-1");

  const sceneGraphIndex = sceneGraphSelect.value;
  const instructionIndex = instructionSelect.value;

  if (sceneGraphIndex === "" || instructionIndex === "") {
    clearDemoOutput1();
    return;
  }

  const sceneGraphData = demoData[sceneGraphIndex];
  const dataItem = sceneGraphData.data_items[instructionIndex];
  displayDemoOutput1(dataItem);

  // Update scene graph panel with selected plan to expand relevant nodes
  renderSceneGraphPanel1(sceneGraphData.scene_graph, dataItem.plan);
}

// Display Demo 1 output (no video)
function displayDemoOutput1(dataItem) {
  const outputContainer = document.getElementById("demo-output-container-1");
  const planContainer = document.getElementById("demo-plan-container-1");

  // Display model output
  if (dataItem.model_output && dataItem.model_output.trim() !== "") {
    outputContainer.innerHTML = `<pre class="demo-output-text">${escapeHtml(dataItem.model_output)}</pre>`;
  } else {
    outputContainer.innerHTML =
      '<p class="has-text-grey-light">No model output available.</p>';
  }

  // Display plan steps
  if (dataItem.plan && dataItem.plan.length > 0) {
    let planHtml = '<ol class="demo-plan-list">';
    dataItem.plan.forEach((step) => {
      planHtml += `<li>${escapeHtml(step)}</li>`;
    });
    planHtml += "</ol>";
    planContainer.innerHTML = planHtml;
  } else {
    planContainer.innerHTML =
      '<p class="has-text-grey-light">No plan available.</p>';
  }
}

// Clear Demo 1 output
function clearDemoOutput1() {
  const outputContainer = document.getElementById("demo-output-container-1");
  const planContainer = document.getElementById("demo-plan-container-1");

  if (outputContainer) {
    outputContainer.innerHTML =
      '<p class="has-text-grey-light">Select a scene graph and instruction to see the output.</p>';
  }
  if (planContainer) {
    planContainer.innerHTML =
      '<p class="has-text-grey-light">Plan steps will appear here.</p>';
  }
}

function clearSceneGraphPanel1() {
  const container = document.getElementById("demo-scenegraph-container-1");
  if (!container) return;

  container.innerHTML =
    '<p class="has-text-grey-light">Select a scene graph to view rooms and containment.</p>';
}

function renderSceneGraphPanel1(sceneGraph, plan) {
  const container = document.getElementById("demo-scenegraph-container-1");
  if (!container) return;

  if (
    !sceneGraph ||
    !Array.isArray(sceneGraph.rooms) ||
    sceneGraph.rooms.length === 0
  ) {
    container.innerHTML =
      '<p class="has-text-grey-light">No scene graph available.</p>';
    return;
  }

  const rooms = Array.isArray(sceneGraph.rooms) ? sceneGraph.rooms : [];
  const furnitures = Array.isArray(sceneGraph.furnitures)
    ? sceneGraph.furnitures
    : [];
  const objects = Array.isArray(sceneGraph.objects) ? sceneGraph.objects : [];
  const links = Array.isArray(sceneGraph.links) ? sceneGraph.links : [];

  const roomsByName = new Map();
  rooms.forEach((room) => {
    if (!room || typeof room.name !== "string") return;
    roomsByName.set(room.name, {
      room,
      furnitures: [],
      objectsByFurniture: new Map(),
    });
  });

  const furnitureByName = new Map();
  furnitures.forEach((f) => {
    if (!f || typeof f.name !== "string") return;
    furnitureByName.set(f.name, f);
  });

  const objectByName = new Map();
  objects.forEach((o) => {
    if (!o || typeof o.name !== "string") return;
    objectByName.set(o.name, o);
  });

  const roomToFurnitures = new Map();
  const furnitureToObjects = new Map();

  links.forEach((triple) => {
    if (!Array.isArray(triple) || triple.length < 3) return;
    const [a, b, rel] = triple;
    if (typeof rel !== "string") return;
    const relNorm = rel.trim().toLowerCase();

    if (relNorm === "in") {
      // room -> furniture
      if (roomsByName.has(a) && furnitureByName.has(b)) {
        if (!roomToFurnitures.has(a)) roomToFurnitures.set(a, []);
        roomToFurnitures.get(a).push(b);
        return;
      }

      // furniture -> object
      if (furnitureByName.has(a) && objectByName.has(b)) {
        if (!furnitureToObjects.has(a)) furnitureToObjects.set(a, []);
        furnitureToObjects.get(a).push(b);
      }
    }

    if (relNorm === "on" || relNorm === "inside" || relNorm === "in") {
      // object on/inside/in furniture
      if (furnitureByName.has(a) && objectByName.has(b)) {
        if (!furnitureToObjects.has(a)) furnitureToObjects.set(a, []);
        furnitureToObjects.get(a).push(b);
      }
    }
  });

  const unassignedFurnitures = [];
  furnitures.forEach((f) => {
    if (!f || typeof f.name !== "string") return;
    let assigned = false;
    for (const [roomName, fList] of roomToFurnitures.entries()) {
      if (fList.includes(f.name) && roomsByName.has(roomName)) {
        roomsByName.get(roomName).furnitures.push(f);
        assigned = true;
      }
    }
    if (!assigned) unassignedFurnitures.push(f);
  });

  const unassignedObjects = [];
  objects.forEach((o) => {
    if (!o || typeof o.name !== "string") return;
    let assigned = false;
    for (const [fName, oList] of furnitureToObjects.entries()) {
      if (oList.includes(o.name) && furnitureByName.has(fName)) {
        assigned = true;
        break;
      }
    }
    if (!assigned) unassignedObjects.push(o);
  });

  // Build per-room objectsByFurniture from the two maps
  for (const roomEntry of roomsByName.values()) {
    roomEntry.furnitures.forEach((f) => {
      const objs = (furnitureToObjects.get(f.name) || [])
        .map((on) => objectByName.get(on))
        .filter(Boolean);
      roomEntry.objectsByFurniture.set(f.name, objs);
    });
  }

  container.innerHTML = "";

  // Add control buttons
  const btnDiv = document.createElement("div");
  btnDiv.style.marginBottom = "0.5rem";
  btnDiv.style.textAlign = "right";

  const btnReset = document.createElement("button");
  btnReset.className = "button is-small is-light";
  btnReset.textContent = "Reset";
  btnReset.style.marginRight = "0.5rem";

  const btnExpandAll = document.createElement("button");
  btnExpandAll.className = "button is-small is-primary is-light";
  btnExpandAll.textContent = "Expand All";

  btnDiv.appendChild(btnReset);
  btnDiv.appendChild(btnExpandAll);
  container.appendChild(btnDiv);

  // Determine implicit involved nodes based on the execution plan
  const planText = (
    Array.isArray(plan) ? plan.join(" ") : plan || ""
  ).toLowerCase();
  const involvedRooms = new Set();
  const involvedFurns = new Set();

  if (planText) {
    // Check which objects/furnitures are mentioned in the plan
    // If an object is mentioned, expand its furniture and room.
    objects.forEach((o) => {
      if (planText.includes((o.name || "").toLowerCase())) {
        // find its furniture
        for (const [fName, oList] of furnitureToObjects.entries()) {
          if (oList.includes(o.name)) {
            involvedFurns.add(fName);
            // finding room for this furniture
            for (const [roomName, fList] of roomToFurnitures.entries()) {
              if (fList.includes(fName)) {
                involvedRooms.add(roomName);
                break;
              }
            }
            break;
          }
        }
      }
    });

    // If furniture is mentioned, expand its room.
    furnitures.forEach((f) => {
      if (planText.includes((f.name || "").toLowerCase())) {
        involvedFurns.add(f.name);
        for (const [roomName, fList] of roomToFurnitures.entries()) {
          if (fList.includes(f.name)) {
            involvedRooms.add(roomName);
            break;
          }
        }
      }
    });

    // If room is directly mentioned, expand it.
    rooms.forEach((r) => {
      if (planText.includes((r.name || "").toLowerCase())) {
        involvedRooms.add(r.name);
      }
    });
  }

  // Set up ECharts
  const chartContainer = document.createElement("div");
  chartContainer.style.width = "100%";
  chartContainer.style.height = "100%";
  chartContainer.style.minHeight = "700px"; // Increased to create more height between levels
  container.appendChild(chartContainer);

  const roomNames = Array.from(roomsByName.keys()).sort();

  const treeData = {
    name: "🏢 Building",
    itemStyle: { color: "#3273dc" },
    collapsed: false, // Explicitly tracked state
    children: [],
  };

  roomNames.forEach((roomName) => {
    const entry = roomsByName.get(roomName);
    const roomNode = {
      name: "🚪 " + roomName,
      itemStyle: { color: "#00d1b2" },
      collapsed: !involvedRooms.has(roomName), // Auto-expand if involved in plan
      children: [],
    };

    const furns = entry.furnitures
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    furns.forEach((f) => {
      const furnNode = {
        name: "🪑 " + f.name,
        itemStyle: { color: "#ffdd57" },
        collapsed: !involvedFurns.has(f.name), // Auto-expand if involved in plan
        children: [],
      };

      const objs = entry.objectsByFurniture.get(f.name) || [];

      if (objs.length === 0) {
        furnNode.children.push({
          name: "(no objects)",
          itemStyle: { color: "#b5b5b5" },
        });
      } else {
        objs
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((o) => {
            furnNode.children.push({
              name: "🧊 " + o.name,
              itemStyle: { color: "#ff3860" },
            });
          });
      }

      roomNode.children.push(furnNode);
    });

    if (furns.length === 0) {
      roomNode.children.push({
        name: "(no furniture)",
        itemStyle: { color: "#b5b5b5" },
      });
    }

    treeData.children.push(roomNode);
  });

  // MAGIC DUMMY NODE: Force the ECharts tree bounding box to always span depth 3 (4 levels).
  // Because it is explicitly marked `collapsed: false`, the tree's maximum depth remains
  // constant during user operations. This perfectly fixes the Y coordinates of layers
  // so the distance between levels doesn't stretch when actual nodes are collapsed!
  treeData.children.push({
    name: "",
    symbolSize: 0,
    itemStyle: { opacity: 0 },
    lineStyle: { opacity: 0 },
    label: { show: false },
    collapsed: false,
    tooltip: { show: false },
    children: [
      {
        name: "",
        symbolSize: 0,
        itemStyle: { opacity: 0 },
        lineStyle: { opacity: 0 },
        label: { show: false },
        collapsed: false,
        tooltip: { show: false },
        children: [
          {
            name: "",
            symbolSize: 0,
            itemStyle: { opacity: 0 },
            lineStyle: { opacity: 0 },
            label: { show: false },
            collapsed: false,
            tooltip: { show: false },
          },
        ],
      },
    ],
  });

  const chart = echarts.init(chartContainer);

  const option = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: [
      {
        type: "tree",
        data: [treeData],
        top: "15%",
        left: "5%",
        bottom: "15%",
        right: "5%",
        layout: "orthogonal",
        orient: "TB", // Top to Bottom
        symbolSize: 10,
        label: {
          position: "right",
          rotate: -45,
          verticalAlign: "middle",
          align: "left",
          fontSize: 13,
          backgroundColor: "#fff",
          padding: 2,
          distance: 5,
          width: 120, // Add max-width
          overflow: "truncate", // Truncate to avoid extremely long names disrupting layout
        },
        leaves: {
          label: {
            position: "bottom",
            rotate: -45,
            verticalAlign: "middle",
            align: "left",
            distance: 8,
            width: 120,
            overflow: "truncate",
          },
        },
        emphasis: {
          focus: "descendant",
        },
        expandAndCollapse: false, // Controlled manually below
        animationDuration: 550,
        animationDurationUpdate: 750,
      },
    ],
  };

  chart.setOption(option);

  // Helper to recursively set collapsed state
  function setCollapsedState(node, state) {
    if (node.children && node.children.length > 0) {
      if (node.name !== "") {
        node.collapsed = state;
      }
      node.children.forEach((child) => setCollapsedState(child, state));
    }
  }

  // Handle "Reset": Expand Building & Rooms, collapse everything else
  btnReset.addEventListener("click", () => {
    treeData.collapsed = false; // Building is expanded
    treeData.children.forEach((room) => {
      if (room.name !== "") {
        room.collapsed = true; // Rooms are collapsed
        setCollapsedState(room, true); // All descendants collapsed
      }
    });
    chart.setOption({ series: [{ data: [treeData] }] });
  });

  // Handle "Expand All"
  btnExpandAll.addEventListener("click", () => {
    // recursively open everything except dummy empty node
    treeData.collapsed = false;
    function openAll(node) {
      if (node.name !== "") {
        node.collapsed = false;
      }
      if (node.children) {
        node.children.forEach((child) => openAll(child));
      }
    }
    openAll(treeData);
    chart.setOption({ series: [{ data: [treeData] }] });
  });

  // Listen to node click: When a node is toggled (expanded or collapsed),
  // force its descendants to be logically collapsed for the future.
  // We manually control `collapsed` states and disable the native `expandAndCollapse`.
  chart.on("click", function (params) {
    if (params.data && params.data.name !== "") {
      function toggleNodeAndDescendants(node, targetName) {
        if (node.name === targetName) {
          if (node.children && node.children.length > 0) {
            // Toggle explicitly
            node.collapsed = !node.collapsed;

            // If it collapsed, collapse all its descendants too
            if (node.collapsed) {
              node.children.forEach((child) => setCollapsedState(child, true));
            }
            return true;
          }
        }
        if (node.children) {
          for (let child of node.children) {
            if (toggleNodeAndDescendants(child, targetName)) return true;
          }
        }
        return false;
      }

      const changed = toggleNodeAndDescendants(treeData, params.data.name);

      if (changed) {
        chart.setOption({ series: [{ data: [treeData] }] });
      }
    }
  });

  // Resize chart on window resize
  window.addEventListener("resize", function () {
    chart.resize();
  });

  if (unassignedFurnitures.length > 0 || unassignedObjects.length > 0) {
    const note = document.createElement("div");
    note.className = "sg-note";
    note.style.marginTop = "1rem";
    note.style.textAlign = "center";
    note.textContent = `Unassigned: ${unassignedFurnitures.length} furniture, ${unassignedObjects.length} object(s)`;
    container.appendChild(note);
  }
}

// ========== Demo 2: Fixed Scene with Video ==========

// Initialize Demo 2 (fixed scene, instruction only)
function initializeDemo2() {
  const instructionSelect = document.getElementById("instruction-select-2");

  if (!instructionSelect) {
    console.error("Demo 2 select elements not found");
    return;
  }

  // Use the first scene graph as the fixed scene
  if (visualizationData.length === 0) {
    console.error("No visualization data available for Demo 2");
    return;
  }

  const fixedSceneData = visualizationData[0];

  // Populate instruction dropdown
  instructionSelect.innerHTML =
    '<option value="">-- Select Instruction --</option>';

  fixedSceneData.data_items.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = item.instruction;
    instructionSelect.appendChild(option);
  });

  // Add event listener
  instructionSelect.addEventListener("change", onInstructionChange2);
}

// Handle instruction selection change for Demo 2
function onInstructionChange2() {
  const instructionSelect = document.getElementById("instruction-select-2");
  const instructionIndex = instructionSelect.value;

  if (instructionIndex === "") {
    clearDemoOutput2();
    return;
  }

  // Always use first scene graph
  const dataItem = visualizationData[0].data_items[instructionIndex];
  displayDemoOutput2(dataItem);
}

// Display Demo 2 output (with video)
function displayDemoOutput2(dataItem) {
  const outputContainer = document.getElementById("demo-output-container-2");
  const planContainer = document.getElementById("demo-plan-container-2");
  const videoContainer = document.getElementById("demo-video-container-2");

  // Display model output
  if (dataItem.model_output && dataItem.model_output.trim() !== "") {
    outputContainer.innerHTML = `<pre class="demo-output-text">${escapeHtml(dataItem.model_output)}</pre>`;
  } else {
    outputContainer.innerHTML =
      '<p class="has-text-grey-light">No model output available.</p>';
  }

  // Display plan steps
  if (dataItem.plan && dataItem.plan.length > 0) {
    let planHtml = '<ol class="demo-plan-list">';
    dataItem.plan.forEach((step) => {
      planHtml += `<li>${escapeHtml(step)}</li>`;
    });
    planHtml += "</ol>";
    planContainer.innerHTML = planHtml;
  } else {
    planContainer.innerHTML =
      '<p class="has-text-grey-light">No plan available.</p>';
  }

  renderDemoVideo(videoContainer, dataItem);
}

// Clear Demo 2 output
function clearDemoOutput2() {
  const outputContainer = document.getElementById("demo-output-container-2");
  const planContainer = document.getElementById("demo-plan-container-2");
  const videoContainer = document.getElementById("demo-video-container-2");

  if (outputContainer) {
    outputContainer.innerHTML =
      '<p class="has-text-grey-light">Select an instruction to see the output.</p>';
  }
  if (planContainer) {
    planContainer.innerHTML =
      '<p class="has-text-grey-light">Plan steps will appear here.</p>';
  }
  if (videoContainer) {
    videoContainer.innerHTML =
      '<p class="has-text-grey-light has-text-centered">Video will appear here.</p>';
  }
}

function renderDemoVideo(container, dataItem) {
  if (!container) return;

  const videoPath = dataItem.video_path;
  const videoUrl = dataItem.video_url;
  const videoId = dataItem.video_id;

  // Priority 1: Use video_path if available
  if (videoPath) {
    const fullPath = videoPath.startsWith("http")
      ? videoPath
      : `${basePath}${videoPath}`;
    container.innerHTML = `
      <video id="demo-video-2" controls autoplay muted loop preload="metadata" style="width: 100%; border-radius: 8px;">
        <source src="${escapeHtml(fullPath)}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
    return;
  }

  // Priority 2: Use video_url
  if (videoUrl) {
    if (isYouTubeUrl(videoUrl)) {
      const embedUrl = getYouTubeEmbedUrl(videoUrl);
      if (embedUrl) {
        container.innerHTML = `
          <div style="position: relative; width: 100%; padding-top: 56.25%; border-radius: 8px; overflow: hidden;">
            <iframe
              src="${escapeHtml(embedUrl)}"
              title="Demo video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;">
            </iframe>
          </div>
        `;
        return;
      }
    }

    container.innerHTML = `
      <video id="demo-video-2" controls autoplay muted loop preload="metadata" style="width: 100%; border-radius: 8px;">
        <source src="${escapeHtml(videoUrl)}">
        Your browser does not support the video tag.
      </video>
    `;
    return;
  }

  // Priority 3: Use video_id
  if (videoId) {
    const videoPathFromId = `${basePath}demos/videos/${videoId}.mp4`;
    container.innerHTML = `
      <video id="demo-video-2" controls autoplay muted loop preload="metadata" style="width: 100%; border-radius: 8px;">
        <source src="${escapeHtml(videoPathFromId)}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
    return;
  }

  container.innerHTML =
    '<p class="has-text-grey-light has-text-centered">No video available.</p>';
}

function isYouTubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

function getYouTubeEmbedUrl(url) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "").trim();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch (error) {
    return null;
  }

  return null;
}

// ========== Shared Utilities ==========

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", loadDemoData);
