import Konva from "konva";
import {GateCircle} from "./gate-circle.konva";
import {Gate, GateConfig} from "./gate.konva";


export interface GateBulbConfig extends GateConfig {
  [key: string]: any;
  handleCircleClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
}

export class GateBulb extends Gate {
  private readonly handleCircleClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
  constructor(config: GateBulbConfig) {
    super(config);
    this.className = 'GateBulb';
    this.handleCircleClick = config.handleCircleClick;
    this._buildGateBulb();
  }

  _buildGateBulb() {
    const centerX = 25;
    const centerY = 10;
    const scale = 0.8;

    // Main bulb glass (elliptical shape)
    const bulbGlass = new Konva.Ellipse({
      x: centerX,
      y: centerY,
      radiusX: 18 * scale,
      radiusY: 22 * scale,
      fill: 'rgba(255, 255, 255, 0.9)',
      stroke: '#444444',
      strokeWidth: 2,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 4,
      shadowOffset: { x: 2, y: 2 }
    });

    // Inner glow when bulb is on (initially hidden)
    const innerGlow = new Konva.Ellipse({
      x: centerX,
      y: centerY,
      radiusX: 16 * scale,
      radiusY: 20 * scale,
      fill: 'rgba(255, 255, 150, 0.4)',
      visible: false
    });

    // Outer glow effect when bulb is on (initially hidden)
    const outerGlow = new Konva.Ellipse({
      x: centerX,
      y: centerY,
      radiusX: 22 * scale,
      radiusY: 26 * scale,
      fill: 'rgba(255, 255, 100, 0.2)',
      visible: false
    });

    // Light rays when bulb is on (initially hidden)
    const lightRays = new Konva.Group({ visible: false });
    
    // Create 8 light rays around the bulb
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const rayLength = 35 * scale;
      const startRadius = 20 * scale;
      
      const ray = new Konva.Line({
        points: [
          centerX + Math.cos(angle) * startRadius,
          centerY + Math.sin(angle) * startRadius,
          centerX + Math.cos(angle) * rayLength,
          centerY + Math.sin(angle) * rayLength
        ],
        stroke: 'rgba(255, 255, 100, 0.6)',
        strokeWidth: 2,
        lineCap: 'round'
      });
      lightRays.add(ray);
    }

    // Realistic filament design
    const filament = new Konva.Group();
    
    // Filament support wires
    const leftSupport = new Konva.Line({
      points: [centerX - 8 * scale, centerY + 15 * scale, centerX - 5 * scale, centerY - 5 * scale],
      stroke: '#666666',
      strokeWidth: 1
    });
    
    const rightSupport = new Konva.Line({
      points: [centerX + 8 * scale, centerY + 15 * scale, centerX + 5 * scale, centerY - 5 * scale],
      stroke: '#666666',
      strokeWidth: 1
    });

    // Filament coil (zigzag pattern)
    const filamentWire = new Konva.Line({
      points: [
        centerX - 5 * scale, centerY - 5 * scale,
        centerX - 2 * scale, centerY - 2 * scale,
        centerX + 2 * scale, centerY - 8 * scale,
        centerX - 2 * scale, centerY - 5 * scale,
        centerX + 2 * scale, centerY - 2 * scale,
        centerX - 2 * scale, centerY + 1 * scale,
        centerX + 2 * scale, centerY + 4 * scale,
        centerX + 5 * scale, centerY - 5 * scale
      ],
      stroke: '#ff4444',
      strokeWidth: 1.5,
      tension: 0.2
    });

    filament.add(leftSupport, rightSupport, filamentWire);

    // Screw base (realistic threading)
    const baseHeight = 12 * scale;
    const baseWidth = 16 * scale;
    const baseY = centerY + 22 * scale;

    const screwBase = new Konva.Rect({
      x: centerX - baseWidth / 2,
      y: baseY,
      width: baseWidth,
      height: baseHeight,
      fill: 'linear-gradient(180deg, #e0e0e0 0%, #a0a0a0 100%)',
      stroke: '#888888',
      strokeWidth: 1,
      cornerRadius: 2
    });

    // Add threading lines to the base
    const threading = new Konva.Group();
    for (let i = 0; i < 4; i++) {
      const threadY = baseY + 2 + (i * 2.5);
      const thread = new Konva.Line({
        points: [centerX - baseWidth / 2 + 1, threadY, centerX + baseWidth / 2 - 1, threadY],
        stroke: '#666666',
        strokeWidth: 0.5
      });
      threading.add(thread);
    }

    // Connection line to input
    const connectionLine = new Konva.Line({
      points: [centerX, baseY + baseHeight, centerX, baseY + baseHeight + 15],
      stroke: '#333333',
      strokeWidth: 2
    });

    // Input connection circle
    const inputCircle = new GateCircle({
      x: centerX, 
      y: baseY + baseHeight + 15, 
      isBulbCircle: true, 
      handleClick: this.handleCircleClick, 
      circleType: 'input'
    });

    // Add all components to the gate
    this.add(outerGlow, lightRays, innerGlow, bulbGlass, filament, screwBase, threading, connectionLine, inputCircle);
  }
}
