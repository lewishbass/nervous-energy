"use client";

import { useEffect, useRef } from "react";

interface GPUStarBackgroundProps {
	count?: number;
	distribution?: string;
}

// WGSL: compute pass integrates particle motion (ping-pong buffers),
// render pass draws them as points via vertex fetch from the same buffer.
const computeShaderCode = /* wgsl */ `
	struct Particle {
		position: vec3<f32>,
		velocity: vec3<f32>,
		opacity: f32,
	};

	@group(0) @binding(0) var<storage, read> src: array<Particle>;
	@group(0) @binding(1) var<storage, read_write> dst: array<Particle>;

	@compute @workgroup_size(64)
	fn computeMain(@builtin(global_invocation_id) id: vec3<u32>) {
		let index = id.x;
		if (index >= arrayLength(&src)) { return; }

		var p = src[index];
		p.position += p.velocity;
		dst[index] = p;
	}
`;

const renderShaderCode = /* wgsl */ `
	struct Particle {
		position: vec3<f32>,
		velocity: vec3<f32>,
		opacity: f32,
	};

	struct VSOut {
		@builtin(position) position: vec4<f32>,
		@location(0) color: vec4<f32>,
	};

	// Column-major 4x4 camera matrix: rotation applied first, then translation.
	struct Camera {
		viewMatrix: mat4x4<f32>,
	};
	@group(0) @binding(0) var<uniform> camera: Camera;

	// Maps camera-space xy to NDC so the star field keeps a square footprint
	// scaled to the larger canvas dimension:
	//   correction.x = scale / width, correction.y = scale / height
	// (scale = max(width, height), so one axis is always 1 and the other
	// compensates for the aspect ratio).
	struct Viewport {
		correction: vec2<f32>,
	};
	@group(0) @binding(1) var<uniform> viewport: Viewport;

	@vertex
	fn vsMain(
		@location(0) position: vec3<f32>,
		@location(1) velocity: vec3<f32>,
		@location(2) opacity: f32,
	) -> VSOut {
		var out: VSOut;


		// transform into camera space: rotation first, then translation offset
		let cameraSpace = camera.viewMatrix * vec4<f32>(position, 1.0);

		let finalBrightness = 2.0 * opacity * pow(cameraSpace.z, -2);

		// perspective divide, then aspect/scale correction to NDC
		let projected = cameraSpace.xy / cameraSpace.z * viewport.correction;
		out.position = vec4<f32>(projected, 0.0, 1.0);
		out.color = vec4<f32>(finalBrightness, finalBrightness, finalBrightness, finalBrightness);
		return out;
	}

	@fragment
	fn fsMain(in: VSOut) -> @location(0) vec4<f32> {
		return in.color;
	}
`;

// Generates the initial particle field by rejection sampling `particleDensity`
// inside a cylinder. Same seed => same output, so both ping-pong buffers can
// be filled identically by running it once per buffer.
const initShaderCode = /* wgsl */ `
	struct Particle {
		position: vec3<f32>,
		velocity: vec3<f32>,
		opacity: f32,
	};

	struct Params {
		seed: u32,
	};

	@group(0) @binding(0) var<storage, read_write> dst: array<Particle>;
	@group(0) @binding(1) var<uniform> params: Params;

	var<private> rngState: u32;

	fn pcg(v: u32) -> u32 {
		let state = v * 747796405u + 2891336453u;
		let word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
		return (word >> 22u) ^ word;
	}

	fn rand() -> f32 {
		rngState = pcg(rngState);
		return f32(rngState) / 4294967296.0;
	}

	// Hash lattice point to one of 16 Perlin gradients (12 distinct + 4 repeats).
	fn gradient(i: vec3<i32>, d: vec3<f32>) -> f32 {
		let h = pcg(u32(i.x) ^ pcg(u32(i.y) ^ pcg(u32(i.z) ^ params.seed))) & 15u;
		let u = select(d.y, d.x, h < 8u);
		let v = select(select(d.z, d.x, h == 12u || h == 14u), d.y, h < 4u);
		return select(-u, u, (h & 1u) == 0u) + select(-v, v, (h & 2u) == 0u);
	}

	// Classic 3D gradient noise, output roughly in [-1, 1].
	fn perlinScalar(p: vec3<f32>) -> f32 {
		let i = vec3<i32>(floor(p));
		let f = fract(p);
		let w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

		let n000 = gradient(i + vec3<i32>(0, 0, 0), f - vec3<f32>(0.0, 0.0, 0.0));
		let n100 = gradient(i + vec3<i32>(1, 0, 0), f - vec3<f32>(1.0, 0.0, 0.0));
		let n010 = gradient(i + vec3<i32>(0, 1, 0), f - vec3<f32>(0.0, 1.0, 0.0));
		let n110 = gradient(i + vec3<i32>(1, 1, 0), f - vec3<f32>(1.0, 1.0, 0.0));
		let n001 = gradient(i + vec3<i32>(0, 0, 1), f - vec3<f32>(0.0, 0.0, 1.0));
		let n101 = gradient(i + vec3<i32>(1, 0, 1), f - vec3<f32>(1.0, 0.0, 1.0));
		let n011 = gradient(i + vec3<i32>(0, 1, 1), f - vec3<f32>(0.0, 1.0, 1.0));
		let n111 = gradient(i + vec3<i32>(1, 1, 1), f - vec3<f32>(1.0, 1.0, 1.0));

		let x00 = mix(n000, n100, w.x);
		let x10 = mix(n010, n110, w.x);
		let x01 = mix(n001, n101, w.x);
		let x11 = mix(n011, n111, w.x);
		return mix(mix(x00, x10, w.y), mix(x01, x11, w.y), w.z) * 0.5;
	}

	// Three decorrelated noise channels via fixed lattice offsets.
	fn perlinNoise(p: vec3<f32>) -> vec3<f32> {
		return vec3<f32>(
			perlinScalar(p),
			perlinScalar(p + vec3<f32>(12331.416, 12347.853, 12312.793)),
			perlinScalar(p + vec3<f32>(12373.129, 12319.347, 12358.601)),
		);
	}

	// Stack perlin noise at multiple frequencies for fractal noise.
	fn fractalPerlin(p: vec3<f32>, octaves: i32) -> vec3<f32> {
		var sum = vec3<f32>(0.0);
		var amp = 1.0;
		var freq = 1.0;
		for (var i = 0; i < octaves; i++) {
			sum += perlinNoise(p * freq) * amp;
			amp *= 0.75;
			freq *= 2.0;
		}
		return sum;
	}

  <distribution_code>

	fn candidate() -> vec3<f32> {
		const spread = 1.01; // how much the edge can disperse
		const falloff = 100.0; // how fast the edg falls off

		let pp_r = rand();
		let pre_r = pp_r + (1.0 / (falloff * (spread - pp_r))) - 1.0 / (falloff * spread) ; // steep falloff at edge
		let r = pow(pre_r, 1.0 / 3.0) * 2.4;
		let theta = rand() * 2.0 * 3.14159265359;
		let cosPhi = rand() * 2.0 - 1.0;
		let sinPhi = sqrt(1.0 - cosPhi * cosPhi);
		return vec3<f32>(r * sinPhi * cos(theta), r * cosPhi, r * sinPhi * sin(theta));
	}

	@compute @workgroup_size(64)
	fn initMain(@builtin(global_invocation_id) id: vec3<u32>) {
		let index = id.x;
		if (index >= arrayLength(&dst)) { return; }

		rngState = pcg(index ^ pcg(params.seed));

		var pos = candidate();
		for (var i = 0; i < 512; i++) {
			if (rand() < particleDensity(pos)) { break; }
			pos = candidate();
		}

		var p: Particle;
		p.position = pos;
		p.velocity = particleVelocity(pos);
		p.opacity = rand();
		dst[index] = p;
	}
`;

const defaultDistribution = `
	// density based on noise combination
	fn particleDensity(p: vec3<f32>) -> f32 {
		const noiseScale = 0.5;
		let p2 = p + fractalPerlin(p * noiseScale * 0.2, 5) * 4.0;
		return fractalPerlin(p2 * noiseScale, 5).x - 0.2;
	}

	fn particleVelocity(p: vec3<f32>) -> vec3<f32> {
		const noiseScale = 0.5;
		return vec3<f32>(fractalPerlin(p * noiseScale * 0.2, 5)) * 0.0001;
	}
		`;

// WGSL struct layout for `Particle` (vec3<f32> has 16-byte alignment):
//   offset  0: position (3 floats) + 1 pad
//   offset 16: velocity (3 floats) + 1 pad
//   offset 28: opacity  (1 float, packs into velocity's trailing pad) -> struct stride = 32 bytes
// The JS-side stride must match exactly or the compute pass reads/writes
// fields at the wrong offsets.
const particleStructSize = 8; // 32 bytes per particle
const particleArrayStride = particleStructSize * 4; // 4 bytes per float

export default function GPUStarBackground({count = 1000000, distribution}: GPUStarBackgroundProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	// dispatchWorkgroups requires a finite, non-negative integer (WebIDL
	// [EnforceRange]); an undefined/NaN prop throws a TypeError before GPU
	// validation runs, so sanitize once up front.
	const particleCount = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;

	useEffect(() => {
		let cancelled = false;
		let raf = 0;
		let running = true;
		const size = { width: 0, height: 0 };
		const viewportCorrection = { aspect: 1, scale: 1 };
		const disposables: Array<{ destroy(): void }> = [];
		
		const cameraOffset = { x: 0, y: 0, z: 3 };
		// Row-major 3x3 camera rotation, initially Rx(-0.3).
		let rot = [1, 0, 0, 0, Math.cos(-0.3), -Math.sin(-0.3), 0, Math.sin(-0.3), Math.cos(-0.3)];

		// Left-multiplies Ry(ay) * Rx(ax), so rotation happens about the camera's current axes.
		const rotateView = (ax: number, ay: number) => {
			const cx = Math.cos(ax), sx = Math.sin(ax);
			const cy = Math.cos(ay), sy = Math.sin(ay);
			const d = [cy, sy * sx, sy * cx, 0, cx, -sx, -sy, cy * sx, cy * cx];
			const out = new Array<number>(9);
			for (let r = 0; r < 3; r++) {
				for (let c = 0; c < 3; c++) {
					out[r * 3 + c] = d[r * 3] * rot[c] + d[r * 3 + 1] * rot[3 + c] + d[r * 3 + 2] * rot[6 + c];
				}
			}
			rot = out;
		};

		// Pointer drag (covers both mouse and touch): horizontal drag distance
		// rotates the camera around the x axis. The last clientX is tracked so
		// each move event only contributes its delta. Bound to the document so
		// drags anywhere rotate the camera; no preventDefault/stopPropagation,
		// so other listeners still receive the events.
		let lastDragX: number | undefined;
		let lastDragY: number | undefined;
		const pointerDown = (e: PointerEvent) => {
			lastDragX = e.clientX;
			lastDragY = e.clientY;
		};
		const pointerMove = (e: PointerEvent) => {
			if (lastDragX === undefined || lastDragY === undefined) return;

			const rotx = (e.clientY - lastDragY) * 0.0006;
			const roty = (e.clientX - lastDragX) * 0.0006;

			rotateView(-rotx, -roty);
			lastDragX = e.clientX;
			lastDragY = e.clientY;
		};
		const pointerUp = () => {
			lastDragX = undefined;
			lastDragY = undefined;
		};

		const init = async () => {
			const canvas = canvasRef.current;
			if (!canvas || cancelled) return;
			if (!("gpu" in navigator)) return;

			const adapter = await navigator.gpu.requestAdapter();
			const device = await adapter?.requestDevice();
			if (!device || cancelled) return;
			disposables.push(device);

			// Bail out early if there is nothing to simulate; also clamp the
			// dispatch count to the adapter's per-dimension limit.
			if (particleCount === 0) return;
			const maxWorkgroups = device.limits.maxComputeWorkgroupsPerDimension;
			const workgroups = Math.min(Math.ceil(particleCount / 64), maxWorkgroups);

			const context = canvas.getContext("webgpu");
			if (!context) return;
			const format = navigator.gpu.getPreferredCanvasFormat();
			context.configure({ device, format, alphaMode: "premultiplied" });

			// ---- buffers ---------------------------------------------------
			// Two ping-pong buffers so the compute pass never reads and writes
			// the same storage buffer in one dispatch. Each is also usable as
			// a vertex buffer (STORAGE | VERTEX) for the render pass.
			const buffers = [0, 1].map(() => {
				const b = device.createBuffer({
					size: particleCount * particleArrayStride,
					usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
				});
				disposables.push(b);
				return b;
			});

			// ---- optional init distribution shader code --------------------------------
			let isc = initShaderCode;
			if (distribution) {
				isc = isc.replace("<distribution_code>", distribution);
			} else {
				isc = isc.replace("<distribution_code>", defaultDistribution);
			}

			// ---- initial distribution (GPU) --------------------------------
			const initPipeline = device.createComputePipeline({
				layout: "auto",
				compute: {
					module: device.createShaderModule({ code: isc }),
					entryPoint: "initMain",
				},
			});
			const initParams = device.createBuffer({
				size: 16,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			});
			disposables.push(initParams);
			device.queue.writeBuffer(initParams, 0, new Uint32Array([(Math.random() * 0xffffffff) >>> 0, 0, 0, 0]));

			// Same seed for both buffers so they start identical.
			const initEncoder = device.createCommandEncoder();
			for (const b of buffers) {
				const pass = initEncoder.beginComputePass();
				pass.setPipeline(initPipeline);
				pass.setBindGroup(0, device.createBindGroup({
					layout: initPipeline.getBindGroupLayout(0),
					entries: [
						{ binding: 0, resource: { buffer: b } },
						{ binding: 1, resource: { buffer: initParams } },
					],
				}));
				pass.dispatchWorkgroups(workgroups);
				pass.end();
			}
			device.queue.submit([initEncoder.finish()]);

			// ---- pipelines -------------------------------------------------
			const computeModule = device.createShaderModule({ code: computeShaderCode });
			const renderModule = device.createShaderModule({ code: renderShaderCode });

			const computePipeline = device.createComputePipeline({
				layout: "auto",
				compute: { module: computeModule, entryPoint: "computeMain" },
			});

			const vertexBufferLayout: GPUVertexBufferLayout = {
				arrayStride: particleArrayStride, // 32 bytes, matches WGSL struct stride
				stepMode: "vertex",
				attributes: [
					{ shaderLocation: 0, offset: 0, format: "float32x3" }, // position
					{ shaderLocation: 1, offset: 16, format: "float32x3" }, // velocity
					{ shaderLocation: 2, offset: 28, format: "float32" }, // opacity
				],
			};

			// Uniform buffer holding the 4x4 camera matrix (16 floats, 256-byte
			// aligned size per WebGPU uniform buffer binding rules).
			const cameraMatrix = new Float32Array(16);
			const cameraBuffer = device.createBuffer({
				size: 256,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			});
			disposables.push(cameraBuffer);

			// Uniform buffer for the viewport correction (scale/w, scale/h).
			// 16 bytes to satisfy the minimum uniform binding size.
			const viewportData = new Float32Array(4);
			const viewportBuffer = device.createBuffer({
				size: 16,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			});
			disposables.push(viewportBuffer);

			const renderPipeline = device.createRenderPipeline({
				layout: "auto",
				vertex: { module: renderModule, entryPoint: "vsMain", buffers: [vertexBufferLayout] },
				fragment: {
					module: renderModule,
					entryPoint: "fsMain",
					targets: [{
						format,
						// Without blending, each point's alpha is written straight
						// to the target and every star renders fully opaque.
						// alphaMode is "premultiplied", so RGB must be scaled by
						// alpha when blending (srcFactor "one" keeps it that way).
						blend: {
							color: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
							alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
						},
					}],
				},
				primitive: { topology: "point-list" },
			});

			const renderBindGroup = device.createBindGroup({
				layout: renderPipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: { buffer: cameraBuffer } },
					{ binding: 1, resource: { buffer: viewportBuffer } },
				],
			});

			// Builds the camera matrix: Rz * Ry * Rx rotation applied to the
			// particle position, then the camera translation offset added.
			// Stored column-major to match WGSL mat4x4 memory layout.
			const updateCameraMatrix = () => {
				// Row-major rotation, transposed on write.
				const [r00, r01, r02, r10, r11, r12, r20, r21, r22] = rot;

				// Column-major: first three entries of each column are the rotated
				// basis vectors; translation goes in the last column.
				cameraMatrix[0] = r00; cameraMatrix[1] = r10; cameraMatrix[2] = r20; cameraMatrix[3] = 0;
				cameraMatrix[4] = r01; cameraMatrix[5] = r11; cameraMatrix[6] = r21; cameraMatrix[7] = 0;
				cameraMatrix[8] = r02; cameraMatrix[9] = r12; cameraMatrix[10] = r22; cameraMatrix[11] = 0;
				cameraMatrix[12] = cameraOffset.x;
				cameraMatrix[13] = cameraOffset.y;
				cameraMatrix[14] = cameraOffset.z;
				cameraMatrix[15] = 1;

				device.queue.writeBuffer(cameraBuffer, 0, cameraMatrix);
			};
			updateCameraMatrix();

			// Bind groups for both ping-pong directions.
			const computeBindGroups = [0, 1].map((i) =>
				device.createBindGroup({
					layout: computePipeline.getBindGroupLayout(0),
					entries: [
						{ binding: 0, resource: { buffer: buffers[i] } },
						{ binding: 1, resource: { buffer: buffers[1 - i] } },
					],
				}),
			);

			// ---- resize ----------------------------------------------------
			const resize = () => {
				const w = canvas.clientWidth;
				const h = canvas.clientHeight;
				if (w === size.width && h === size.height) return;
				size.width = w;
				size.height = h;
				canvas.width = w;
				canvas.height = h;
				viewportCorrection.aspect = w / h;
				viewportCorrection.scale = Math.max(w, h);

				// Shader correction: multiply camera-space xy by (scale/w, scale/h)
				// so the field fills the larger dimension and keeps its aspect.
				viewportData[0] = viewportCorrection.scale / w;
				viewportData[1] = viewportCorrection.scale / h;
				device.queue.writeBuffer(viewportBuffer, 0, viewportData);
			};
			resize();

			// ---- loop ------------------------------------------------------
			// Per-frame work only. Reads/writes the vars above; never setState.
			let frame = 0;
			let lastTime: number | undefined;
			const loop = (time: number) => {
				if (!running) return;

				const deltaTime = time - (lastTime ?? time);
				lastTime = time;

				rotateView(0, 0.00001 * deltaTime);
				updateCameraMatrix();

				const commandEncoder = device.createCommandEncoder();

				const computePass = commandEncoder.beginComputePass();
				computePass.setPipeline(computePipeline);
				computePass.setBindGroup(0, computeBindGroups[frame % 2]);
				computePass.dispatchWorkgroups(workgroups);
				computePass.end();

				const renderPass = commandEncoder.beginRenderPass({
					colorAttachments: [{
						view: context.getCurrentTexture().createView(),
						clearValue: { r: 0, g: 0, b: 0, a: 0 },
						loadOp: "clear",
						storeOp: "store",
					}],
				});
				renderPass.setPipeline(renderPipeline);
				renderPass.setBindGroup(0, renderBindGroup);
				renderPass.setVertexBuffer(0, buffers[(frame + 1) % 2]);
				renderPass.draw(particleCount);
				renderPass.end();

				device.queue.submit([commandEncoder.finish()]);
				frame++;

				raf = requestAnimationFrame(loop);
			};

			raf = requestAnimationFrame(loop);

			// ResizeObserver catches element-driven size changes that a window
			// resize event misses; it only mutates the vars above, no setState.
			const observer = new ResizeObserver(resize);
			observer.observe(canvas);
			// Bound to the document so drags anywhere rotate the camera. No
			// preventDefault/stopPropagation, so other drag listeners (on the
			// canvas or elements below) still receive the events.
			document.addEventListener("pointerdown", pointerDown);
			document.addEventListener("pointermove", pointerMove);
			document.addEventListener("pointerup", pointerUp);
			document.addEventListener("pointercancel", pointerUp);

			return () => {
				running = false;
				cancelAnimationFrame(raf);
				observer.disconnect();
				document.removeEventListener("pointerdown", pointerDown);
				document.removeEventListener("pointermove", pointerMove);
				document.removeEventListener("pointerup", pointerUp);
				document.removeEventListener("pointercancel", pointerUp);
			};
		};

		const cleanupPromise = init();

		return () => {
			cancelled = true;
			running = false;
			cancelAnimationFrame(raf);
			cleanupPromise.then((fn) => fn?.());
			for (const d of disposables) d.destroy();
			disposables.length = 0;
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 dark:invert-0 invert"
			style={{ width: "100%", height: "100%", opacity: 0.5 }}
		/>
	);
}
