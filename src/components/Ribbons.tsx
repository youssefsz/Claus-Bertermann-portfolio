import React, { useEffect, useRef } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';

interface RibbonsProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
  backgroundColor?: number[];
}

const Ribbons: React.FC<RibbonsProps> = ({
  colors = ['#06b6d4', '#14b8a6', '#f97316', '#fb7185'],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 28,
  offsetFactor = 0.05,
  maxAge = 450,
  pointCount = 50,
  speedMultiplier = 0.55,
  enableFade = false,
  enableShaderEffect = true,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0]
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: window.devicePixelRatio || 2, alpha: true });
    const gl = renderer.gl;
    if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
      gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
    } else {
      gl.clearColor(0, 0, 0, 0);
    }

    gl.canvas.style.position = 'fixed';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100vw';
    gl.canvas.style.height = '100vh';
    gl.canvas.style.pointerEvents = 'none';
    gl.canvas.style.zIndex = '10';
    gl.canvas.style.overflow = 'hidden';
    document.body.appendChild(gl.canvas);

    const scene = new Transform();
    const lines: {
      spring: number;
      friction: number;
      mouseVelocity: Vec3;
      mouseOffset: Vec3;
      points: Vec3[];
      polyline: Polyline;
    }[] = [];

    const vertex = `
      precision highp float;
      
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;
      
      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;
      uniform float uTime;
      uniform float uEnableShaderEffect;
      uniform float uEffectAmplitude;
      
      varying vec2 vUV;
      
      vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 tangent = normalize(nextScreen - prevScreen);
          vec2 normal = vec2(-tangent.y, tangent.x);
          normal /= aspect;
          normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
          float dist = length(nextScreen - prevScreen);
          normal *= smoothstep(0.0, 0.02, dist);
          float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
          float pixelWidth = current.w * pixelWidthRatio;
          normal *= pixelWidth * uThickness;
          current.xy -= normal * side;
          if(uEnableShaderEffect > 0.5) {
            current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
          }
          return current;
      }
      
      void main() {
          vUV = uv;
          gl_Position = getPosition();
      }
    `;


    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      lines.forEach(line => line.polyline.resize());
    }
    window.addEventListener('resize', resize);

    // Create a single ribbon with gradient colors
    const spring = baseSpring;
    const friction = baseFriction;
    const thickness = baseThickness;
    const mouseOffset = new Vec3(0, 0, 0);

    const line = {
      spring,
      friction,
      mouseVelocity: new Vec3(),
      mouseOffset,
      points: [] as Vec3[],
      polyline: {} as Polyline
    };

    const count = pointCount;
    const points: Vec3[] = [];
    for (let i = 0; i < count; i++) {
      points.push(new Vec3());
    }
    line.points = points;

    // Create gradient fragment shader
    const gradientFragment = `
      precision highp float;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;
      uniform float uOpacity;
      uniform float uEnableFade;
      uniform float uTime;
      varying vec2 vUV;
      
      void main() {
          float fadeFactor = 1.0;
          if(uEnableFade > 0.5) {
              fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
          }
          
          // Create a gradient that cycles through all 4 colors
          float gradientPos = vUV.y + sin(uTime * 0.5) * 0.1;
          gradientPos = mod(gradientPos, 1.0);
          
          vec3 color;
          if(gradientPos < 0.25) {
              color = mix(uColor1, uColor2, gradientPos * 4.0);
          } else if(gradientPos < 0.5) {
              color = mix(uColor2, uColor3, (gradientPos - 0.25) * 4.0);
          } else if(gradientPos < 0.75) {
              color = mix(uColor3, uColor4, (gradientPos - 0.5) * 4.0);
          } else {
              color = mix(uColor4, uColor1, (gradientPos - 0.75) * 4.0);
          }
          
          gl_FragColor = vec4(color, uOpacity * fadeFactor);
      }
    `;

    line.polyline = new Polyline(gl, {
      points,
      vertex,
      fragment: gradientFragment,
      uniforms: {
        uColor1: { value: new Color(colors[0]) },
        uColor2: { value: new Color(colors[1]) },
        uColor3: { value: new Color(colors[2]) },
        uColor4: { value: new Color(colors[3]) },
        uThickness: { value: thickness },
        uOpacity: { value: 1.0 },
        uTime: { value: 0.0 },
        uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
        uEffectAmplitude: { value: effectAmplitude },
        uEnableFade: { value: enableFade ? 1.0 : 0.0 }
      }
    });
    line.polyline.mesh.setParent(scene);
    lines.push(line);

    resize();

    const mouse = new Vec3();
    // Initialize mouse position to center of screen
    mouse.set(0, 0, 0);
    
    function updateMouse(e: MouseEvent | TouchEvent) {
      let x: number, y: number;
      if ('changedTouches' in e && e.changedTouches.length) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
      } else {
        x = 0;
        y = 0;
      }
      const width = window.innerWidth;
      const height = window.innerHeight;
      mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);
    }
    document.addEventListener('mousemove', updateMouse);
    document.addEventListener('touchstart', updateMouse);
    document.addEventListener('touchmove', updateMouse);
    
    // Add initial mouse position update
    const initialMouseEvent = new MouseEvent('mousemove', {
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2
    });
    updateMouse(initialMouseEvent);

    const tmp = new Vec3();
    let frameId: number;
    let lastTime = performance.now();
    function update() {
      frameId = requestAnimationFrame(update);
      const currentTime = performance.now();
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      lines.forEach(line => {
        tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
        line.mouseVelocity.add(tmp).multiply(line.friction);
        line.points[0].add(line.mouseVelocity);

        for (let i = 1; i < line.points.length; i++) {
          if (isFinite(maxAge) && maxAge > 0) {
            const segmentDelay = maxAge / (line.points.length - 1);
            const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
            line.points[i].lerp(line.points[i - 1], alpha);
          } else {
            line.points[i].lerp(line.points[i - 1], 0.9);
          }
        }
        if (line.polyline.mesh.program.uniforms.uTime) {
          line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
        }
        line.polyline.updateGeometry();
      });

      renderer.render({ scene });
    }
    update();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', updateMouse);
      document.removeEventListener('touchstart', updateMouse);
      document.removeEventListener('touchmove', updateMouse);
      cancelAnimationFrame(frameId);
      if (gl.canvas && gl.canvas.parentNode === document.body) {
        document.body.removeChild(gl.canvas);
      }
    };
  }, [
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    pointCount,
    speedMultiplier,
    enableFade,
    enableShaderEffect,
    effectAmplitude,
    backgroundColor
  ]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }} />;
};

export default Ribbons;
