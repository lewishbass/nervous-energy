'use client';

import { useEffect, useRef } from 'react';

const VERTEX_SHADER_SOURCE = `
	attribute vec2 aPosition;
	varying vec2 vUv;

	void main() {
		vUv = aPosition * 0.5 + 0.5;
		gl_Position = vec4(aPosition, 0.0, 1.0);
	}
`;

const FRAGMENT_SHADER_SOURCE = `
	precision highp float;

	varying vec2 vUv;

	uniform vec2 uResolution;
	uniform float uTime;

	vec4 fade4(vec4 t) {
		return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
	}

	vec4 hash4(vec4 p) {
		p = vec4(
			dot(p, vec4(127.1, 311.7, 74.7, 269.5)),
			dot(p, vec4(269.5, 183.3, 246.1, 113.5)),
			dot(p, vec4(113.5, 271.9, 124.6, 197.3)),
			dot(p, vec4(246.1, 127.1, 311.7, 74.7))
		);
		return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
	}

	float gradDot(vec4 latticePoint, vec4 offset) {
		return dot(hash4(latticePoint), offset);
	}

	float perlinNoise4D(vec4 p) {
		vec4 pi = floor(p);
		vec4 pf = p - pi;
		vec4 w = fade4(pf);

		float n0000 = gradDot(pi + vec4(0.0, 0.0, 0.0, 0.0), pf - vec4(0.0, 0.0, 0.0, 0.0));
		float n1000 = gradDot(pi + vec4(1.0, 0.0, 0.0, 0.0), pf - vec4(1.0, 0.0, 0.0, 0.0));
		float n0100 = gradDot(pi + vec4(0.0, 1.0, 0.0, 0.0), pf - vec4(0.0, 1.0, 0.0, 0.0));
		float n1100 = gradDot(pi + vec4(1.0, 1.0, 0.0, 0.0), pf - vec4(1.0, 1.0, 0.0, 0.0));
		float n0010 = gradDot(pi + vec4(0.0, 0.0, 1.0, 0.0), pf - vec4(0.0, 0.0, 1.0, 0.0));
		float n1010 = gradDot(pi + vec4(1.0, 0.0, 1.0, 0.0), pf - vec4(1.0, 0.0, 1.0, 0.0));
		float n0110 = gradDot(pi + vec4(0.0, 1.0, 1.0, 0.0), pf - vec4(0.0, 1.0, 1.0, 0.0));
		float n1110 = gradDot(pi + vec4(1.0, 1.0, 1.0, 0.0), pf - vec4(1.0, 1.0, 1.0, 0.0));
		float n0001 = gradDot(pi + vec4(0.0, 0.0, 0.0, 1.0), pf - vec4(0.0, 0.0, 0.0, 1.0));
		float n1001 = gradDot(pi + vec4(1.0, 0.0, 0.0, 1.0), pf - vec4(1.0, 0.0, 0.0, 1.0));
		float n0101 = gradDot(pi + vec4(0.0, 1.0, 0.0, 1.0), pf - vec4(0.0, 1.0, 0.0, 1.0));
		float n1101 = gradDot(pi + vec4(1.0, 1.0, 0.0, 1.0), pf - vec4(1.0, 1.0, 0.0, 1.0));
		float n0011 = gradDot(pi + vec4(0.0, 0.0, 1.0, 1.0), pf - vec4(0.0, 0.0, 1.0, 1.0));
		float n1011 = gradDot(pi + vec4(1.0, 0.0, 1.0, 1.0), pf - vec4(1.0, 0.0, 1.0, 1.0));
		float n0111 = gradDot(pi + vec4(0.0, 1.0, 1.0, 1.0), pf - vec4(0.0, 1.0, 1.0, 1.0));
		float n1111 = gradDot(pi + vec4(1.0, 1.0, 1.0, 1.0), pf - vec4(1.0, 1.0, 1.0, 1.0));

		float a000 = mix(n0000, n1000, w.x);
		float a100 = mix(n0100, n1100, w.x);
		float a010 = mix(n0010, n1010, w.x);
		float a110 = mix(n0110, n1110, w.x);
		float a001 = mix(n0001, n1001, w.x);
		float a101 = mix(n0101, n1101, w.x);
		float a011 = mix(n0011, n1011, w.x);
		float a111 = mix(n0111, n1111, w.x);

		float b00 = mix(a000, a100, w.y);
		float b10 = mix(a010, a110, w.y);
		float b01 = mix(a001, a101, w.y);
		float b11 = mix(a011, a111, w.y);

		float d0 = mix(b00, b10, w.z);
		float d1 = mix(b01, b11, w.z);

		return mix(d0, d1, w.w);
	}

	float fbm(vec3 pos, float time) {
		float value = 0.0;
		float amplitude = 0.5;
		float frequency = 1.0;
		for (int i = 0; i < 2; i++) {
			value += amplitude * perlinNoise4D(vec4(pos * frequency, time * frequency));
			frequency *= 2.0;
			amplitude *= 0.5;
		}
		return value;
	}

  vec4 softmax(vec4 x, float k) {
		float maxVal = max(max(x.x, x.y), max(x.z, x.w));
		float sumExp = exp(k * (x.x - maxVal)) + exp(k * (x.y - maxVal)) + exp(k * (x.z - maxVal)) + exp(k * (x.w - maxVal));
		return vec4(exp(k * (x.x - maxVal)) / sumExp, exp(k * (x.y - maxVal)) / sumExp, exp(k * (x.z - maxVal)) / sumExp, exp(k * (x.w - maxVal)) / sumExp);
	
	}

	void main() {
		vec2 aspectUv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

		float scale = 3.0;
		float n = fbm(vec3(aspectUv * scale, 0.0), uTime * 0.025)*0.5 + 0.5;
		float v = fbm(vec3(aspectUv * scale, 0.0), uTime * 0.025 + 2000.0)*0.5 + 0.5;
		float s = fbm(vec3(aspectUv * scale, 0.0), uTime * 0.025 + 1000.0)*0.5 + 0.5;
	
		vec4 color = softmax(vec4(n, s, v, 0.0), 200.0);

		const vec4 col1 = vec4(0.22, 0.0, 0.6, 1.0); // #390099
		const vec4 col2 = vec4(0.62, 0.0, 0.35, 1.0); // #9e0059
		const vec4 col3 = vec4(1.0, 0.0, 0.33, 1.0); // #ff0054

		gl_FragColor = col1 * color.x + col2 * color.y + col3 * color.z;

	}
`;

export default function TeacherHudBackground() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
		if (!gl) return;

		const compileShader = (type: number, source: string) => {
			const shader = gl.createShader(type);
			if (!shader) return null;
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.error('Shader compile error:', gl.getShaderInfoLog(shader));
				gl.deleteShader(shader);
				return null;
			}
			return shader;
		};

		const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
		const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
		if (!vertexShader || !fragmentShader) return;

		const program = gl.createProgram();
		if (!program) return;
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Program link error:', gl.getProgramInfoLog(program));
			return;
		}
		gl.useProgram(program);

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW
		);

		const aPosition = gl.getAttribLocation(program, 'aPosition');
		gl.enableVertexAttribArray(aPosition);
		gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

		const uTimeLocation = gl.getUniformLocation(program, 'uTime');
		const uResolutionLocation = gl.getUniformLocation(program, 'uResolution');

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			gl.viewport(0, 0, canvas.width, canvas.height);
		};
		resize();
		window.addEventListener('resize', resize);

		const startTime = performance.now();
		let animationFrameId = 0;

		const render = () => {
			const elapsed = (performance.now() - startTime) / 1000;
			if (uTimeLocation) gl.uniform1f(uTimeLocation, elapsed);
			if (uResolutionLocation) gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			animationFrameId = requestAnimationFrame(render);
		};
		animationFrameId = requestAnimationFrame(render);

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationFrameId);
			if (positionBuffer) gl.deleteBuffer(positionBuffer);
			if (program) gl.deleteProgram(program);
			if (vertexShader) gl.deleteShader(vertexShader);
			if (fragmentShader) gl.deleteShader(fragmentShader);
		};
	}, []);

	return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" />;
}
