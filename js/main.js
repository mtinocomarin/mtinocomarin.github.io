const toggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
}

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

const skillTree = document.querySelector('[data-skill-tree]');

if (skillTree) {
  const stage = skillTree.querySelector('[data-tree-stage]');
  const status = skillTree.querySelector('.tree-status');
  const viewToggle = skillTree.querySelector('[data-tree-view-toggle]');
  const tablePanel = skillTree.querySelector('[data-tree-table-panel]');
  const branches = [
    { name: 'Computer Vision', position: [50, 12], items: ['OpenCV', 'Stereo Vision', 'Visual SLAM', 'Camera Calibration', 'Rectification', 'FoundationStereo', 'Open3D', 'YOLO', 'PyTorch', 'Point Clouds'] },
    { name: 'Robotics', position: [80, 23], items: ['ROS / ROS2', 'SLAM', 'Visual SLAM', 'Nav2', 'LiDAR', 'RealSense', 'NVIDIA Jetson', 'Motor Control', 'Arduino', 'Unity'] },
    { name: 'Embedded Systems', position: [86, 56], items: ['STM32', 'ARM Cortex-M', 'Microcontrollers', 'Embedded C', 'Embedded Software', 'Bare-Metal', 'FreeRTOS', 'ADC + DMA', 'UART + I2C', 'RISC-V', 'FPGA', 'Verilog'] },
    { name: 'Research', position: [70, 85], items: ['Research Skills', 'Testing', 'EMG', 'Signal Processing', 'Sensor Fusion', 'Data Analysis', 'Machine Learning', 'Artificial Intelligence', 'Linear Regression', 'Mathematics', 'Problem Solving', 'Documentation'] },
    { name: 'Equipment', position: [30, 85], items: ['AD2 Logic Analyzer', 'Oscilloscope', 'EMG Sensors', 'ToF Sensors', 'Stereo Cameras', 'IMU', 'Pressure Sensors', 'STM32CubeIDE', 'Keil uVision', 'Quartus Prime', 'PSpice', 'SOLIDWORKS'] },
    { name: 'Leadership', position: [14, 56], items: ['Team Leadership', 'Research Supervisor', 'Lab Instructor', 'Mentoring', 'Coaching', 'Communication', 'Project Planning', 'Teamwork', 'Task Planning', 'Client Meetings'] },
    { name: 'Programming', position: [20, 23], items: ['C', 'C++', 'Python', 'Java', 'ARM Assembly', 'Assembly Language', 'Bash + Linux', 'Object-Oriented Programming', 'Software Development', 'Data Structures', 'Git', 'GitHub', 'Game Development'] }
  ];

  let pinned = false;
  let activeBranch = null;
  let openTimer = null;

  const clearTimers = () => {
    window.clearTimeout(openTimer);
  };

  const addNode = (label, x, y, className) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tree-node ${className}`;
    button.style.left = `${x}%`;
    button.style.top = `${y}%`;
    button.innerHTML = label;
    stage.appendChild(button);
    return button;
  };

  const addLine = (x1, y1, x2, y2, className = '') => {
    const line = document.createElement('span');
    const dx = x2 - x1;
    const dy = y2 - y1;
    line.className = `tree-line ${className}`;
    line.style.left = `${x1}%`;
    line.style.top = `${y1}%`;
    line.style.width = `${Math.hypot(dx, dy)}%`;
    line.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
    stage.appendChild(line);
    return line;
  };

  const setLeafFocus = (focusedNode) => {
    stage.querySelectorAll('.tree-node.leaf').forEach((node) => {
      node.classList.toggle('subdued', Boolean(focusedNode) && node !== focusedNode);
      node.classList.toggle('spotlight', node === focusedNode);
    });
  };

  const renderRoot = () => {
    clearTimers();
    pinned = false;
    activeBranch = null;
    skillTree.classList.remove('is-expanded', 'is-pinned', 'is-dense');
    stage.dataset.view = 'root';
    stage.replaceChildren();
    status.textContent = 'Hover to preview - click to keep open';

    branches.forEach((branch) => addLine(50, 50, ...branch.position, 'root-line'));
    addNode('SKILLS<small>EXPLORE THE MAP</small>', 50, 50, 'root');

    branches.forEach((branch) => {
      const node = addNode(branch.name, ...branch.position, 'branch');
      node.setAttribute('aria-label', `Explore ${branch.name} skills`);
      node.addEventListener('pointerenter', () => {
        clearTimers();
        node.classList.add('is-charging');
        status.textContent = `Hold to open ${branch.name}`;
        openTimer = window.setTimeout(() => renderBranch(branch, false), 950);
      });
      node.addEventListener('pointerleave', () => {
        window.clearTimeout(openTimer);
        node.classList.remove('is-charging');
        status.textContent = 'Hover to preview - click to keep open';
      });
      node.addEventListener('focus', () => {
        status.textContent = `Press Enter to open ${branch.name}`;
      });
      node.addEventListener('click', (event) => {
        event.stopPropagation();
        renderBranch(branch, true);
      });
    });
  };

  const renderBranch = (branch, shouldPin) => {
    clearTimers();
    pinned = shouldPin;
    activeBranch = branch;
    skillTree.classList.add('is-expanded');
    skillTree.classList.toggle('is-pinned', pinned);
    skillTree.classList.toggle('is-dense', branch.items.length > 9);
    stage.dataset.view = 'branch';
    stage.replaceChildren();
    status.textContent = `${branch.name} - ${branch.items.length} connected nodes${pinned ? ' - pinned' : ''}`;

    const center = [50, 50];
    const radius = branch.items.length > 9 ? 41 : 38;
    const leafPositions = branch.items.map((item, index) => {
      const angle = (-90 + (360 / branch.items.length) * index) * Math.PI / 180;
      return {
        item,
        x: center[0] + Math.cos(angle) * radius,
        y: center[1] + Math.sin(angle) * radius * 0.82
      };
    });

    leafPositions.forEach((position) => addLine(...center, position.x, position.y, 'branch-line'));

    const activeNode = addNode(branch.name, ...branch.position, 'active entering');
    activeNode.setAttribute('aria-label', `Close ${branch.name} branch`);
    activeNode.addEventListener('click', (event) => {
      event.stopPropagation();
      renderRoot();
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        activeNode.style.left = '50%';
        activeNode.style.top = '50%';
        activeNode.classList.remove('entering');
      });
    });

    leafPositions.forEach((position, index) => {
      const node = addNode(position.item, position.x, position.y, 'leaf');
      node.style.animationDelay = `${120 + index * 55}ms`;
      node.addEventListener('pointerenter', () => {
        clearTimers();
        setLeafFocus(node);
        status.textContent = position.item;
      });
      node.addEventListener('pointerleave', () => {
        if (!node.classList.contains('selected')) {
          setLeafFocus(stage.querySelector('.tree-node.leaf.selected'));
          status.textContent = `${branch.name} - ${branch.items.length} connected nodes${pinned ? ' - pinned' : ''}`;
        }
      });
      node.addEventListener('focus', () => setLeafFocus(node));
      node.addEventListener('click', (event) => {
        event.stopPropagation();
        const wasSelected = node.classList.contains('selected');
        stage.querySelectorAll('.tree-node.leaf').forEach((leaf) => leaf.classList.remove('selected'));
        node.classList.toggle('selected', !wasSelected);
        setLeafFocus(wasSelected ? null : node);
        pinned = true;
        skillTree.classList.add('is-pinned');
        status.textContent = wasSelected ? `${branch.name} - ${branch.items.length} connected nodes` : `${position.item} - selected`;
      });
    });

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'tree-back';
    back.textContent = 'Back to all branches';
    back.addEventListener('click', (event) => {
      event.stopPropagation();
      renderRoot();
    });
    stage.appendChild(back);
  };

  stage.addEventListener('pointermove', (event) => {
    if (stage.dataset.view === 'root') {
      stage.querySelectorAll('.tree-node.branch').forEach((node) => {
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        const proximity = Math.max(0, Math.min(1, 1 - distance / 220));
        node.style.setProperty('--node-brightness', (1 + proximity * 0.42).toFixed(3));
        node.style.setProperty('--node-scale', (1 + proximity * 0.08).toFixed(3));
        node.style.setProperty('--node-glow', `${(5 + proximity * 28).toFixed(1)}px`);
        node.style.setProperty('--node-glow-alpha', (0.04 + proximity * 0.28).toFixed(3));
        node.style.setProperty('--halo-opacity', (proximity * 0.55).toFixed(3));
        node.style.setProperty('--halo-scale', (1 + proximity * 0.16).toFixed(3));
      });
    }
  });
  stage.addEventListener('pointerleave', () => {
    stage.querySelectorAll('.tree-node.branch').forEach((node) => {
      node.style.removeProperty('--node-brightness');
      node.style.removeProperty('--node-scale');
      node.style.removeProperty('--node-glow');
      node.style.removeProperty('--node-glow-alpha');
      node.style.removeProperty('--halo-opacity');
      node.style.removeProperty('--halo-scale');
      node.classList.remove('is-charging');
    });
    window.clearTimeout(openTimer);
  });
  stage.addEventListener('click', (event) => {
    if (event.target === stage || event.target.classList.contains('tree-line')) renderRoot();
  });
  const sourceTable = document.querySelector('.skills-table');
  if (viewToggle && tablePanel && sourceTable) {
    const tableCopy = sourceTable.cloneNode(true);
    tableCopy.setAttribute('aria-label', 'Complete skills table');
    tablePanel.querySelector('.tree-table-panel-inner').appendChild(tableCopy);
    viewToggle.addEventListener('click', () => {
      const showTable = !skillTree.classList.contains('show-table');
      skillTree.classList.toggle('show-table', showTable);
      viewToggle.setAttribute('aria-pressed', String(showTable));
      viewToggle.innerHTML = showTable ? '<span aria-hidden="true">◎</span> Map View' : '<span aria-hidden="true">▦</span> Table View';
      tablePanel.hidden = !showTable;
      if (!showTable) renderRoot();
    });
  }

  renderRoot();
}
