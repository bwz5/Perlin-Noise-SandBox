import * as THREE from 'three';

export const sandSize = 0.20; 

export class Sand {
    static geometry = new THREE.BoxGeometry( sandSize, sandSize, sandSize );
    constructor(x_pos, y_pos, z_pos, scene, color = '#a88b32'){
        const material = new THREE.MeshPhongMaterial({color});

        this.box = new THREE.Mesh( Sand.geometry, material );
        this.box.position.x = x_pos; 
        this.box.position.y = y_pos; 
        this.box.position.z = z_pos;
        // add our phong box to the scene 
        scene.add(this.box);
    }
};