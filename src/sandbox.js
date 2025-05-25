import {Sand, sandSize} from "/sand.js";
import perlin from "/perlin.js";

// centered at 0,0,0
export class Sandbox {
    constructor(x_length, y_height, z_width, scene) {
      this.x_length = x_length;
      this.y_height = y_height;
      this.z_width = z_width;
      this.scene = scene;
  
      this.s_dimensionX = Math.floor(x_length / sandSize);
      this.s_dimensionY = Math.floor(y_height / sandSize);
      this.s_dimensionZ = Math.floor(z_width / sandSize);
  
      this.initGrid();
      perlin.seed();
      this.populateWithPerlin();
      this.removeHidden();
    }
  
    initGrid() {
      this.sand = Array.from({ length: this.s_dimensionX }, () =>
        Array.from({ length: this.s_dimensionY }, () =>
          new Array(this.s_dimensionZ).fill(null)
        )
      );
    }
  
    populateWithPerlin() {
      for (let i = 0; i < this.s_dimensionX; i++) {
        const x = i * sandSize;
        for (let j = 0; j < this.s_dimensionZ; j++) {
          const z = j * sandSize;
          let height = perlin.get(x, z); 
          height = (height + 1) / 2;  // normalize height between 0 and 1
  
          const maxY = Math.floor(height * this.s_dimensionY);
          for (let k = 0; k < maxY; k++) {
            const y = k * sandSize;
            
            // coloring the blocks using HSL CSS formatting 
            const hue = 30; 
            const lightness = 5 + (k / this.s_dimensionY) * 85; 
            const color = `hsl(${hue}, 60%, ${lightness}%)`;

            const sandBlock = new Sand(x, y, z, this.scene, color);
            this.sand[i][k][j] = sandBlock;
          }
        }
      }
    }
    // hidden blocks are blocks with all neighbors filled 
    removeHidden() {
      const directions = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
      ];
  
      for (let i = 0; i < this.s_dimensionX; i++) {
        for (let j = 0; j < this.s_dimensionY; j++) {
          for (let k = 0; k < this.s_dimensionZ; k++) {
            const block = this.sand[i][j][k];
            if (block == null) continue;
  
            let hidden = true;
            for (const [dx, dy, dz] of directions) {
              const x = i + dx;
              const y = j + dy;
              const z = k + dz;
              if (
                x < 0 || x >= this.s_dimensionX ||
                y < 0 || y >= this.s_dimensionY ||
                z < 0 || z >= this.s_dimensionZ ||
                this.sand[x][y][z] == null
              ) {
                hidden = false;
                break;
              }
            }
  
            if (hidden) {
              this.scene.remove(block.box);
              this.sand[i][j][k] = null;
            }
          }
        }
      }
    }
    
    update() {
        for (let i = 0; i < this.s_dimensionX; i++){
            for (let k = 0; k < this.s_dimensionZ; k++){
                for (let j = this.s_dimensionY -1; j >= 0; j--){
                    if (this.sand[i][j][k] != null && j != 0){
                        // we need to check if the box below it has sand 
                        if (this.sand[i][j-1][k] == null){
                            this.sand[i][j-1][k] = this.sand[i][j][k]; 
                            this.sand[i][j][k] = null; 

                            this.sand[i][j - 1][k].box.position.y -= sandSize;
                        }
                    }
                }
            }
        }
    }
};