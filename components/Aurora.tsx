"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const DEFAULT_COLOR_STOPS = ['#5227FF', '#7cff67', '#5227FF'];
const CSS_VAR_REGEX = /var\((--[a-zA-Z0-9-_]+)\)/;
const DEFAULT_AMPLITUDE = 1;
const DEFAULT_BLEND = 0.5;
const DEFAULT_BIAS = 0;
const DEFAULT_MIDPOINT = 0.2;
const DEFAULT_INTENSITY_SCALE = 0.6;
const DEFAULT_BASE_COLOR = '#ffffff';
const DEFAULT_BASE_STRENGTH = 0;

type AuroraThemeSettings = {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  bias?: number;
  midPoint?: number;
  intensityScale?: number;
  baseColor?: string;
  baseStrength?: number;
};

type AuroraRuntimeState = {
  colorStops: string[];
  amplitude: number;
  blend: number;
  bias: number;
  midPoint: number;
  intensityScale: number;
  baseColor: [number, number, number];
  baseStrength: number;
  time?: number;
  speed?: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function hslToRgbArray(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hue >= 0 && hue < 60) {
    r = c;
    g = x;
  } else if (hue >= 60 && hue < 120) {
    r = x;
    g = c;
  } else if (hue >= 120 && hue < 180) {
    g = c;
    b = x;
  } else if (hue >= 180 && hue < 240) {
    g = x;
    b = c;
  } else if (hue >= 240 && hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return [r + m, g + m, b + m];
}

function parseRgbString(raw: string): [number, number, number] | null {
  const match = raw.match(/^rgba?\(([^)]+)\)$/i);
  if (!match) return null;
  const parts = match[1]
    .split(/[,\s/]+/)
    .map(part => part.trim())
    .filter(Boolean);
  if (parts.length < 3) return null;
  const toComponent = (value: string) => {
    if (value.endsWith('%')) {
      return clamp01(parseFloat(value) / 100) * 255;
    }
    return parseFloat(value);
  };
  const r = toComponent(parts[0]);
  const g = toComponent(parts[1]);
  const b = toComponent(parts[2]);
  if ([r, g, b].some(component => Number.isNaN(component))) return null;
  return [r / 255, g / 255, b / 255];
}

function parseHslString(raw: string): [number, number, number] | null {
  const match = raw.match(/^hsla?\(([^)]+)\)$/i);
  if (!match) return null;
  const parts = match[1]
    .split(/[,\s/]+/)
    .map(part => part.trim())
    .filter(Boolean);
  if (parts.length < 3) return null;
  const h = parseFloat(parts[0]);
  const s = clamp01(parseFloat(parts[1].replace('%', '')) / 100);
  const l = clamp01(parseFloat(parts[2].replace('%', '')) / 100);
  if ([h, s, l].some(component => Number.isNaN(component))) return null;
  return hslToRgbArray(h, s, l);
}

function parseBareHsl(raw: string): [number, number, number] | null {
  const parts = raw
    .split(/\s+/)
    .map(part => part.trim())
    .filter(Boolean);
  if (parts.length < 3) return null;
  const h = parseFloat(parts[0]);
  const s = clamp01(parseFloat(parts[1].replace('%', '')) / 100);
  const l = clamp01(parseFloat(parts[2].replace('%', '')) / 100);
  if ([h, s, l].some(component => Number.isNaN(component))) return null;
  return hslToRgbArray(h, s, l);
}

function parseHex(raw: string): [number, number, number] | null {
  if (!raw.startsWith('#')) return null;
  let hex = raw.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('');
  }
  if (hex.length !== 6) return null;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if ([r, g, b].some(component => Number.isNaN(component))) return null;
  return [r / 255, g / 255, b / 255];
}

function resolveCssVariable(value: string): string | null {
  const match = value.match(CSS_VAR_REGEX);
  if (!match || typeof window === 'undefined') return null;
  const computed = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
  if (!computed) return null;
  if (computed.startsWith('#') || computed.startsWith('rgb') || computed.startsWith('hsl')) {
    return computed;
  }
  if (/^[\d.\s%/]+$/.test(computed)) {
    return `hsl(${computed})`;
  }
  return computed;
}

const fallbackStop = (index: number) =>
  DEFAULT_COLOR_STOPS[index] ?? DEFAULT_COLOR_STOPS[DEFAULT_COLOR_STOPS.length - 1];

function ensureThreeStops(stops: string[]): string[] {
  const resolved = stops.slice(0, 3);
  while (resolved.length < 3) {
    resolved.push(fallbackStop(resolved.length));
  }
  return resolved;
}

function colorStopToRGB(stop: string, fallback: string): [number, number, number] {
  const normalized =
    resolveCssVariable(stop) ??
    stop ??
    fallback;

  const parsers = [parseHex, parseRgbString, parseHslString, parseBareHsl];
  for (const parser of parsers) {
    const result = parser(normalized.trim());
    if (result) return result;
  }

  // Fall back to hex parsing to avoid runtime errors.
  return parseHex(fallback) ?? parseHex(DEFAULT_COLOR_STOPS[0])!;
}

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uBias;
uniform float uMidPoint;
uniform float uIntensityScale;
uniform vec3 uBaseColor;
uniform float uBaseStrength;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = max(0.0, uIntensityScale * height + uBias);
  
  float auroraAlpha = smoothstep(uMidPoint - uBlend * 0.5, uMidPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  float baseInfluence = (1.0 - smoothstep(0.0, 0.5, uv.y)) * uBaseStrength;
  auroraColor = mix(uBaseColor, auroraColor, 1.0 - baseInfluence);
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps extends AuroraThemeSettings {
  time?: number;
  speed?: number;
  lightSettings?: AuroraThemeSettings;
  darkSettings?: AuroraThemeSettings;
}

export default function Aurora(props: AuroraProps) {
  const {
    colorStops,
    amplitude,
    blend,
    bias,
    midPoint,
    intensityScale,
    time,
    speed,
    lightSettings,
    darkSettings
  } = props;

  const { resolvedTheme } = useTheme();
  const themeMode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const baseSettings: AuroraThemeSettings = { colorStops, amplitude, blend, bias, midPoint, intensityScale };
  const themeOverrides = themeMode === 'dark' ? darkSettings : lightSettings;
  const mergedSettings: AuroraThemeSettings = { ...baseSettings, ...themeOverrides };

  const resolvedColorStops = ensureThreeStops(mergedSettings.colorStops ?? DEFAULT_COLOR_STOPS);
  const resolvedAmplitude = mergedSettings.amplitude ?? DEFAULT_AMPLITUDE;
  const resolvedBlend = mergedSettings.blend ?? DEFAULT_BLEND;
  const resolvedBias = mergedSettings.bias ?? DEFAULT_BIAS;
  const resolvedMidPoint = mergedSettings.midPoint ?? DEFAULT_MIDPOINT;
  const resolvedIntensityScale = mergedSettings.intensityScale ?? DEFAULT_INTENSITY_SCALE;
  const resolvedBaseColor = colorStopToRGB(mergedSettings.baseColor ?? DEFAULT_BASE_COLOR, DEFAULT_BASE_COLOR);
  const resolvedBaseStrength = clamp01(mergedSettings.baseStrength ?? DEFAULT_BASE_STRENGTH);

  const propsRef = useRef<AuroraRuntimeState>({
    colorStops: resolvedColorStops,
    amplitude: resolvedAmplitude,
    blend: resolvedBlend,
    bias: resolvedBias,
    midPoint: resolvedMidPoint,
    intensityScale: resolvedIntensityScale,
    baseColor: resolvedBaseColor,
    baseStrength: resolvedBaseStrength,
    time,
    speed
  });

  useEffect(() => {
    propsRef.current = {
      colorStops: resolvedColorStops,
      amplitude: resolvedAmplitude,
      blend: resolvedBlend,
      bias: resolvedBias,
      midPoint: resolvedMidPoint,
      intensityScale: resolvedIntensityScale,
      baseColor: resolvedBaseColor,
      baseStrength: resolvedBaseStrength,
      time,
      speed
    };
  }, [resolvedColorStops, resolvedAmplitude, resolvedBlend, resolvedBias, resolvedMidPoint, resolvedIntensityScale, resolvedBaseColor, resolvedBaseStrength, time, speed]);

  const ctnDom = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn || !propsRef.current) return;
    const runtime = propsRef.current;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    const programRef: { current: Program | undefined } = { current: undefined };

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (programRef.current) {
        programRef.current.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = runtime.colorStops.map((stop, index) => colorStopToRGB(stop, fallbackStop(index)));

    programRef.current = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: runtime.amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: runtime.blend },
        uBias: { value: runtime.bias },
        uMidPoint: { value: runtime.midPoint },
        uIntensityScale: { value: runtime.intensityScale },
        uBaseColor: { value: runtime.baseColor },
        uBaseStrength: { value: runtime.baseStrength }
      }
    });

    const mesh = new Mesh(gl, { geometry, program: programRef.current });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      const current = propsRef.current;
      if (programRef.current && current) {
        const program = programRef.current;
        const currentTime = current.time ?? t * 0.01;
        const currentSpeed = current.speed ?? 1.0;
        program.uniforms.uTime.value = currentTime * currentSpeed * 0.1;
        program.uniforms.uAmplitude.value = current.amplitude;
        program.uniforms.uBlend.value = current.blend;
        program.uniforms.uBias.value = current.bias;
        program.uniforms.uMidPoint.value = current.midPoint;
        program.uniforms.uIntensityScale.value = current.intensityScale;
        program.uniforms.uBaseColor.value = current.baseColor;
        program.uniforms.uBaseStrength.value = current.baseStrength;
        program.uniforms.uColorStops.value = current.colorStops.map((stop: string, index: number) =>
          colorStopToRGB(stop, fallbackStop(index))
        );
        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);

    resize();

    // Signal ready after a short delay so the first frame has rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true);
      });
    });

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div
      ref={ctnDom}
      className="w-full h-full"
      style={{
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.2s ease-in',
      }}
    />
  );
}
