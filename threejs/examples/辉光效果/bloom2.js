import * as THREE from '../../build/three.module.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { scene, camera, renderer } from './scene.js';
import { cube, cube2, cube3 } from './model.js';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;
const fragmentShader = `
  uniform sampler2D baseTexture;
  uniform sampler2D bloomTexture;

  varying vec2 vUv;

  void main() {

    gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

  }
`;

const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );
const params = {
  exposure: 1,
  bloomStrength: 5,
  bloomThreshold: 0,
  bloomRadius: 0,
  scene: 'Scene with Glow'
};
const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

const renderScene = new RenderPass( scene, camera );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const finalPass = new ShaderPass(
  new THREE.ShaderMaterial( {
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    defines: {}
  } ), 'baseTexture'
);
finalPass.needsSwap = true;

const finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );

const gui = new GUI();
const folder = gui.addFolder( 'Bloom Parameters' );
folder.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
  bloomPass.threshold = Number( value );
  render();
} );
folder.add( params, 'bloomStrength', 0.0, 10.0 ).onChange( function ( value ) {
  bloomPass.strength = Number( value );
  render();
} );
folder.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
  bloomPass.radius = Number( value );
  render();
} );

function darkenNonBloomed( obj ) {
  if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
    materials[ obj.uuid ] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial( obj ) {
  if ( materials[ obj.uuid ] ) {
    obj.material = materials[ obj.uuid ];
    delete materials[ obj.uuid ];
  }
}

function render() {
  scene.traverse( darkenNonBloomed );
  bloomComposer.render();
  scene.traverse( restoreMaterial );
  finalComposer.render();
}

scene.add(cube, cube2, cube3);
cube2.layers.toggle( BLOOM_SCENE );
console.log(camera.layers, cube.layers, cube2.layers, cube3.layers);

export {
  render
};