"use strict";
class Render {
  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID);
        try {
            this.gl = this.canvas.getContext("webgl");
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        } catch(e) {
            var msg = "Error WebGL: " + e.toString();
            alert(msg);
            throw Error(msg);
        }
        if (!this.gl) {
            console.error("Erro ao iniciar o WebGL.");
            return;
        }
        var vertexShaderSource = document.getElementById("meu-vertex-shader").text;
        var fragmentShaderSource = document.getElementById("meu-fragment-shader").text;
        // Criamos os shaders GLSL: upload do GLSL fonte e compilamos
        var vertexShader = Render.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = Render.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        // Ligamos os dois shaders em um programa
        this.programa = Render.createProgram(this.gl, vertexShader, fragmentShader);
        //Procuramos a posição de memória dos dados do vértice
        this.positionAttributeLocation =
        this.gl.getAttribLocation(this.programa, "posicao");
        // Criamos um buffer para inserir as coordenadas nele
        this.positionBuffer = this.gl.createBuffer();
        // Associamos o buffer criado a ARRAY_BUFFER
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
  }

  static createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  static createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  
  draw() {
    this.gl.clearColor(0,0,0,1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // Escolhe qual programa utilizar
    this.gl.useProgram(this.programa);
    var positions = [0, 0, 0, 0, 0.5, 0, 0.5, 0, 0];
    // Colocamos as coordenadas no buffer
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    // Ativa o atributo
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    // Associa ao position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    // Explica como usar os dados do positionBuffer (ARRAY_BUFFER)
    var size = 3;    // 3 componentes por iteração
    var type = this.gl.FLOAT;   // os dados são 32bit floats
    var normalize = false; // sem normalizar os dados
    var stride = 0;      
    var offset = 0;      // posição inicial do buffer
    this.gl.vertexAttribPointer( this.positionAttributeLocation, size, type, normalize, stride, offset);
    // Desenhar!
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    this.gl.drawArrays(primitiveType, offset, count);
  }
}

