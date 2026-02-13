/**
 * TERMINAL TAKEOVER - ASCII Network Map
 * Renders and animates the horizontal scrolling ASCII network diagram
 */

class ASCIIMap {
  constructor(canvasId, minimapCanvasId) {
    this.canvas = document.getElementById(canvasId);
    this.minimapCanvas = document.getElementById(minimapCanvasId);
    this.ctx = this.canvas.getContext('2d');
    this.minimapCtx = this.minimapCanvas.getContext('2d');

    // Viewport settings
    this.viewport = {
      x: 0,
      y: 0,
      width: 120,
      height: 40
    };

    // Map dimensions (in characters)
    this.mapWidth = 500;
    this.mapHeight = 80;

    // Character size
    this.charWidth = 8;
    this.charHeight = 16;

    // Animation state
    this.animationFrame = null;
    this.packets = [];

    // Interaction state
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Nodes
    this.nodes = [
      { x: 250, y: 10, width: 30, height: 7, label: 'BERKE.SH', type: 'root' },
      { x: 150, y: 30, width: 20, height: 10, label: 'SKILLS', type: 'section' },
      { x: 250, y: 30, width: 25, height: 10, label: 'EXPERIENCE', type: 'section' },
      { x: 350, y: 30, width: 20, height: 10, label: 'PROJECTS', type: 'section' },
      { x: 150, y: 55, width: 22, height: 8, label: 'EDUCATION', type: 'section' },
      { x: 350, y: 55, width: 18, height: 8, label: 'CONTACT', type: 'section' }
    ];

    // Colors
    this.colors = {
      bg: '#000000',
      fg: '#00ff41',
      node: '#00ff41',
      line: '#00ff41',
      packet: '#ff79c6',
      highlight: '#ffff00'
    };

    this.currentNode = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.onMouseUp());
    this.canvas.addEventListener('mouseleave', () => this.onMouseUp());
    this.canvas.addEventListener('click', (e) => this.onClick(e));

    // Keyboard events
    document.addEventListener('keydown', (e) => this.onKeyDown(e));

    // Start animation
    this.animate();

    // Generate initial packets
    this.generatePackets();
    setInterval(() => this.generatePackets(), 2000);
  }

  resize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;

    this.viewport.width = Math.floor(this.canvas.width / this.charWidth);
    this.viewport.height = Math.floor(this.canvas.height / this.charHeight);

    // Resize minimap
    this.minimapCanvas.width = 200;
    this.minimapCanvas.height = 120;
  }

  drawChar(char, x, y, color = this.colors.fg) {
    if (
      x < this.viewport.x ||
      x >= this.viewport.x + this.viewport.width ||
      y < this.viewport.y ||
      y >= this.viewport.y + this.viewport.height
    ) {
      return; // Outside viewport
    }

    const screenX = (x - this.viewport.x) * this.charWidth;
    const screenY = (y - this.viewport.y) * this.charHeight;

    this.ctx.fillStyle = color;
    this.ctx.font = `${this.charHeight}px 'Fira Code', monospace`;
    this.ctx.fillText(char, screenX, screenY + this.charHeight - 2);
  }

  drawText(text, x, y, color = this.colors.fg) {
    for (let i = 0; i < text.length; i++) {
      this.drawChar(text[i], x + i, y, color);
    }
  }

  drawBox(x, y, width, height, color = this.colors.node) {
    // Top line
    this.drawChar('╔', x, y, color);
    for (let i = 1; i < width - 1; i++) {
      this.drawChar('═', x + i, y, color);
    }
    this.drawChar('╗', x + width - 1, y, color);

    // Sides
    for (let j = 1; j < height - 1; j++) {
      this.drawChar('║', x, y + j, color);
      this.drawChar('║', x + width - 1, y + j, color);
    }

    // Bottom line
    this.drawChar('╚', x, y + height - 1, color);
    for (let i = 1; i < width - 1; i++) {
      this.drawChar('═', x + i, y + height - 1, color);
    }
    this.drawChar('╝', x + width - 1, y + height - 1, color);
  }

  drawLine(x1, y1, x2, y2, color = this.colors.line) {
    // Simple line drawing using ASCII characters
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let x = x1;
    let y = y1;

    while (true) {
      const char = dx > dy ? '─' : '│';
      this.drawChar(char, x, y, color);

      if (x === x2 && y === y2) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  drawNode(node) {
    const color = this.currentNode === node ? this.colors.highlight : this.colors.node;

    // Draw box
    this.drawBox(node.x, node.y, node.width, node.height, color);

    // Draw label
    const labelX = node.x + Math.floor((node.width - node.label.length) / 2);
    const labelY = node.y + Math.floor(node.height / 2);
    this.drawText(node.label, labelX, labelY, color);

    // Draw highlight markers if current
    if (this.currentNode === node) {
      this.drawText('>>>', node.x - 4, labelY, this.colors.highlight);
      this.drawText('<<<', node.x + node.width + 1, labelY, this.colors.highlight);
    }
  }

  drawConnections() {
    // Root to sections
    const root = this.nodes[0];
    const rootCenterX = root.x + Math.floor(root.width / 2);
    const rootBottom = root.y + root.height;

    for (let i = 1; i <= 3; i++) {
      const node = this.nodes[i];
      const nodeCenterX = node.x + Math.floor(node.width / 2);
      const nodeTop = node.y;

      this.drawLine(rootCenterX, rootBottom, nodeCenterX, nodeTop, this.colors.line);
    }

    // Skills to Education
    const skills = this.nodes[1];
    const education = this.nodes[4];
    this.drawLine(
      skills.x + Math.floor(skills.width / 2),
      skills.y + skills.height,
      education.x + Math.floor(education.width / 2),
      education.y,
      this.colors.line
    );

    // Projects to Contact
    const projects = this.nodes[3];
    const contact = this.nodes[5];
    this.drawLine(
      projects.x + Math.floor(projects.width / 2),
      projects.y + projects.height,
      contact.x + Math.floor(contact.width / 2),
      contact.y,
      this.colors.line
    );
  }

  generatePackets() {
    // Create animated data packets traveling along connections
    const packet = {
      from: this.nodes[0],
      to: this.nodes[1 + Math.floor(Math.random() * 3)],
      progress: 0,
      char: '◆',
      color: this.colors.packet
    };

    this.packets.push(packet);
  }

  updatePackets() {
    this.packets = this.packets.filter(packet => {
      packet.progress += 0.02;

      if (packet.progress >= 1) {
        return false; // Remove packet
      }

      // Draw packet
      const fromX = packet.from.x + Math.floor(packet.from.width / 2);
      const fromY = packet.from.y + packet.from.height;
      const toX = packet.to.x + Math.floor(packet.to.width / 2);
      const toY = packet.to.y;

      const x = Math.floor(fromX + (toX - fromX) * packet.progress);
      const y = Math.floor(fromY + (toY - fromY) * packet.progress);

      this.drawChar(packet.char, x, y, packet.color);

      return true;
    });
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections
    this.drawConnections();

    // Draw nodes
    this.nodes.forEach(node => this.drawNode(node));

    // Update and draw packets
    this.updatePackets();

    // Render minimap
    this.renderMinimap();
  }

  renderMinimap() {
    const minimapCtx = this.minimapCtx;
    const scale = Math.min(
      this.minimapCanvas.width / this.mapWidth,
      this.minimapCanvas.height / this.mapHeight
    );

    // Clear
    minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    minimapCtx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

    // Draw nodes
    minimapCtx.fillStyle = this.colors.node;
    this.nodes.forEach(node => {
      minimapCtx.fillRect(
        node.x * scale,
        node.y * scale,
        node.width * scale,
        node.height * scale
      );
    });

    // Draw viewport
    const viewport = document.querySelector('.minimap-viewport');
    if (viewport) {
      viewport.style.left = `${this.viewport.x * scale}px`;
      viewport.style.top = `${this.viewport.y * scale}px`;
      viewport.style.width = `${this.viewport.width * scale}px`;
      viewport.style.height = `${this.viewport.height * scale}px`;
    }
  }

  animate() {
    this.render();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  // ===== INTERACTION =====

  onMouseDown(e) {
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    this.canvas.style.cursor = 'grabbing';
  }

  onMouseMove(e) {
    if (!this.isDragging) return;

    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;

    this.pan(-Math.floor(dx / this.charWidth), -Math.floor(dy / this.charHeight));

    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  onMouseUp() {
    this.isDragging = false;
    this.canvas.style.cursor = 'grab';
  }

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.charWidth) + this.viewport.x;
    const y = Math.floor((e.clientY - rect.top) / this.charHeight) + this.viewport.y;

    // Check if clicked on a node
    for (const node of this.nodes) {
      if (
        x >= node.x &&
        x < node.x + node.width &&
        y >= node.y &&
        y < node.y + node.height
      ) {
        this.jumpToNode(node);
        break;
      }
    }
  }

  onKeyDown(e) {
    const panSpeed = 5;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.pan(0, -panSpeed);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.pan(0, panSpeed);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.pan(-panSpeed, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.pan(panSpeed, 0);
        break;
    }
  }

  pan(dx, dy) {
    this.viewport.x = Math.max(0, Math.min(this.mapWidth - this.viewport.width, this.viewport.x + dx));
    this.viewport.y = Math.max(0, Math.min(this.mapHeight - this.viewport.height, this.viewport.y + dy));
  }

  jumpToNode(node) {
    this.currentNode = node;

    // Animate panning to node
    const targetX = node.x - Math.floor(this.viewport.width / 2) + Math.floor(node.width / 2);
    const targetY = node.y - Math.floor(this.viewport.height / 2) + Math.floor(node.height / 2);

    if (typeof anime !== 'undefined') {
      anime({
        targets: this.viewport,
        x: Math.max(0, Math.min(this.mapWidth - this.viewport.width, targetX)),
        y: Math.max(0, Math.min(this.mapHeight - this.viewport.height, targetY)),
        duration: 800,
        easing: 'easeInOutQuad'
      });
    } else {
      this.viewport.x = Math.max(0, Math.min(this.mapWidth - this.viewport.width, targetX));
      this.viewport.y = Math.max(0, Math.min(this.mapHeight - this.viewport.height, targetY));
    }
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Global instance
let asciiMap = null;
