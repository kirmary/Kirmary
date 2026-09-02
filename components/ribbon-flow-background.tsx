'use client';

import { useEffect, useRef } from 'react';

const vertexShaderSource = `
  precision mediump float;

  attribute vec3 a_position;

  uniform float u_time;
  uniform mat4 u_projection;
  uniform mat4 u_modelView;

  varying vec3 vEC;
  varying vec2 vUv;

  float iqhash(float n) {
    return fract(sin(n) * 43758.5453);
  }

  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f * f * (3.0 - 2.0 * f);

    float n = p.x + p.y * 57.0 + 113.0 * p.z;

    return mix(
      mix(
        mix(
          iqhash(n),
          iqhash(n + 1.0),
          f.x
        ),
        mix(
          iqhash(n + 57.0),
          iqhash(n + 58.0),
          f.x
        ),
        f.y
      ),
      mix(
        mix(
          iqhash(n + 113.0),
          iqhash(n + 114.0),
          f.x
        ),
        mix(
          iqhash(n + 170.0),
          iqhash(n + 171.0),
          f.x
        ),
        f.y
      ),
      f.z
    );
  }

  float waveNoise(vec3 x, float time) {
    return
      cos(x.z * 4.0) *
      cos(x.z + time / 10.0 + x.x);
  }

  void main() {
    vec3 pos = a_position;

    vUv = (pos.xy + 1.0) * 0.5;

    vec3 v = vec3(
      pos.x,
      0.0,
      pos.y
    );

    vec3 v2 = v;
    vec3 v3 = v;

    v.y = waveNoise(v2, u_time) / 8.0;

    v3.x -= u_time / 5.0;
    v3.x /= 4.0;
    v3.z -= u_time / 10.0;
    v3.y -= u_time / 100.0;

    v.z -= noise(v3 * 7.0) / 15.0;

    v.y -=
      noise(v3 * 7.0) / 15.0 +
      cos(v.x * 2.0 - u_time / 2.0) / 5.0 -
      0.3;

    vEC = v;

    mat4 mvp =
      u_projection *
      u_modelView;

    gl_Position = mvp * vec4(v, 1.0);
  }
`;

const fragmentShaderSource = `
  #ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
  #endif

  precision mediump float;

  varying vec3 vEC;
  varying vec2 vUv;

  uniform float u_time;

  vec3 themeColor(float progress) {
    float wave =
      0.5 +
      0.5 *
      sin(progress * 3.14159 * 1.4);

    /*
     * KIRMARY BLUE
     */
    vec3 kirmaryBlue =
      vec3(0.12, 0.28, 0.76);

    /*
     * KIRMARY RED
     */
    vec3 kirmaryRed =
      vec3(0.82, 0.13, 0.16);

    return clamp(
      mix(
        kirmaryBlue,
        kirmaryRed,
        wave
      ),
      0.0,
      1.0
    );
  }

  void main() {
    #ifdef GL_OES_standard_derivatives
      vec3 up = vec3(0.0, 0.0, 1.0);
      vec3 x = dFdx(vEC);
      vec3 y = dFdy(vEC);

      vec3 normal =
        normalize(cross(x, y));

      float c =
        1.0 -
        dot(normal, up);

      c =
        (1.0 - cos(c * c)) /
        3.0;
    #else
      float c = 0.35;
    #endif

    float vignette =
      1.0 -
      length(vUv - 0.5) * 0.8;

    float alpha =
      clamp(
        c * vignette * 1.35,
        0.0,
        1.0
      );

    vec3 base =
      vec3(0.025, 0.04, 0.12);

    vec3 accent =
      themeColor(
        vUv.x +
        u_time * 0.05
      );

    float highlight =
      pow(c, 1.25);

    vec3 color =
      mix(
        base,
        accent,
        0.88
      ) +
      accent *
      highlight *
      0.42;

    color = clamp(
      color,
      0.0,
      1.0
    );

    gl_FragColor =
      vec4(color, alpha);
  }
`;

function createPerspectiveMatrix(
  fovDegrees: number,
  aspect: number,
  near: number,
  far: number
) {
  const fov =
    (fovDegrees * Math.PI) /
    180;

  const f =
    1 /
    Math.tan(fov / 2);

  const nf =
    1 /
    (near - far);

  return new Float32Array([
    f / aspect,
    0,
    0,
    0,

    0,
    f,
    0,
    0,

    0,
    0,
    (far + near) * nf,
    -1,

    0,
    0,
    2 * far * near * nf,
    0
  ]);
}

function createIdentityMatrix() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

export default function RibbonFlowBackground() {
  const holderRef =
    useRef<HTMLDivElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const holder = holderRef.current;
    const canvas = canvasRef.current;

    if (!holder || !canvas) {
      return;
    }

    const gl =
      (canvas.getContext('webgl', {
        antialias: true,
        alpha: true
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext(
        'experimental-webgl'
      ) as WebGLRenderingContext | null);

    if (!gl) {
      console.error(
        'RibbonFlow: WebGL is not supported.'
      );

      return;
    }

    gl.getExtension(
      'OES_standard_derivatives'
    );

    let frameId: number | null = null;

    let vertexBuffer:
      | WebGLBuffer
      | null = null;

    let indexBuffer:
      | WebGLBuffer
      | null = null;

    let program:
      | WebGLProgram
      | null = null;

    let indexCount = 0;

    const resolution =
      window.innerWidth < 768
        ? 90
        : 128;

    const devicePixelRatio =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    const compileShader = (
      type: number,
      source: string
    ) => {
      const shader =
        gl.createShader(type);

      if (!shader) {
        return null;
      }

      gl.shaderSource(
        shader,
        source
      );

      gl.compileShader(shader);

      if (
        !gl.getShaderParameter(
          shader,
          gl.COMPILE_STATUS
        )
      ) {
        console.error(
          `RibbonFlow shader error:`,
          gl.getShaderInfoLog(shader)
        );

        gl.deleteShader(shader);

        return null;
      }

      return shader;
    };

    const vertexShader =
      compileShader(
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragmentShader =
      compileShader(
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );

    if (
      !vertexShader ||
      !fragmentShader
    ) {
      return;
    }

    const createdProgram =
      gl.createProgram();

    if (!createdProgram) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      return;
    }

    program = createdProgram;

    gl.attachShader(
      program,
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.linkProgram(program);

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      console.error(
        'RibbonFlow program error:',
        gl.getProgramInfoLog(program)
      );

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);

      program = null;

      return;
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    gl.useProgram(program);

    const vertices: number[] = [];
    const indices: number[] = [];

    for (
      let y = 0;
      y <= resolution;
      y += 1
    ) {
      for (
        let x = 0;
        x <= resolution;
        x += 1
      ) {
        const u =
          (x / resolution) * 2 - 1;

        const v =
          (y / resolution) * 2 - 1;

        vertices.push(
          u,
          v,
          0
        );
      }
    }

    for (
      let y = 0;
      y < resolution;
      y += 1
    ) {
      for (
        let x = 0;
        x < resolution;
        x += 1
      ) {
        const a =
          y *
            (resolution + 1) +
          x;

        const b = a + 1;

        const c =
          a +
          (resolution + 1);

        const d = c + 1;

        indices.push(
          a,
          c,
          b
        );

        indices.push(
          b,
          c,
          d
        );
      }
    }

    indexCount = indices.length;

    vertexBuffer =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      vertexBuffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW
    );

    indexBuffer =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      indexBuffer
    );

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    const positionLocation =
      gl.getAttribLocation(
        program,
        'a_position'
      );

    if (positionLocation >= 0) {
      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        vertexBuffer
      );

      gl.vertexAttribPointer(
        positionLocation,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.enableVertexAttribArray(
        positionLocation
      );
    }

    const timeLocation =
      gl.getUniformLocation(
        program,
        'u_time'
      );

    const projectionLocation =
      gl.getUniformLocation(
        program,
        'u_projection'
      );

    const modelViewLocation =
      gl.getUniformLocation(
        program,
        'u_modelView'
      );

    gl.enable(gl.BLEND);

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.disable(gl.DEPTH_TEST);

    const handleResize = () => {
      const width =
        holder.offsetWidth ||
        window.innerWidth;

      const height =
        holder.offsetHeight ||
        window.innerHeight;

      canvas.width =
        Math.max(
          1,
          Math.floor(
            width * devicePixelRatio
          )
        );

      canvas.height =
        Math.max(
          1,
          Math.floor(
            height * devicePixelRatio
          )
        );

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      gl.viewport(
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    const startTime =
      performance.now();

    const renderFrame = (
      now: number
    ) => {
      if (!program) {
        return;
      }

      const elapsed =
        reducedMotion
          ? 1.5
          : (now - startTime) * 0.001;

      const aspect =
        canvas.width /
        Math.max(canvas.height, 1);

      gl.clearColor(
        0,
        0,
        0,
        0
      );

      gl.clear(
        gl.COLOR_BUFFER_BIT
      );

      const projectionMatrix =
        createPerspectiveMatrix(
          75,
          aspect,
          0.1,
          100
        );

      const modelViewMatrix =
        createIdentityMatrix();

      modelViewMatrix[14] = -2;

      const scale =
        Math.max(
          1.25,
          aspect * 1.55
        );

      modelViewMatrix[0] = scale;
      modelViewMatrix[5] = 0.78;

      gl.useProgram(program);

      gl.uniformMatrix4fv(
        projectionLocation,
        false,
        projectionMatrix
      );

      gl.uniformMatrix4fv(
        modelViewLocation,
        false,
        modelViewMatrix
      );

      gl.uniform1f(
        timeLocation,
        elapsed
      );

      gl.bindBuffer(
        gl.ELEMENT_ARRAY_BUFFER,
        indexBuffer
      );

      gl.drawElements(
        gl.TRIANGLES,
        indexCount,
        gl.UNSIGNED_SHORT,
        0
      );

      if (!reducedMotion) {
        frameId =
          requestAnimationFrame(
            renderFrame
          );
      }
    };

    handleResize();

    window.addEventListener(
      'resize',
      handleResize,
      {
        passive: true
      }
    );

    const resizeObserver =
      new ResizeObserver(
        handleResize
      );

    resizeObserver.observe(holder);

    frameId =
      requestAnimationFrame(
        renderFrame
      );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );

      resizeObserver.disconnect();

      if (frameId !== null) {
        cancelAnimationFrame(
          frameId
        );
      }

      if (vertexBuffer) {
        gl.deleteBuffer(
          vertexBuffer
        );
      }

      if (indexBuffer) {
        gl.deleteBuffer(
          indexBuffer
        );
      }

      if (program) {
        gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <div
      ref={holderRef}
      className="ribbon-flow-background"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="ribbon-flow-background__canvas"
      />

      <div className="ribbon-flow-background__shade" />
    </div>
  );
}