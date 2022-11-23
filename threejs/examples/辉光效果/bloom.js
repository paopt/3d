import * as THREE from '../../build/three.module.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { scene, camera, renderer } from './scene.js';

const params = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0
};
const renderScene = new RenderPass( scene, camera );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );

const gui = new GUI();
gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {
  renderer.toneMappingExposure = Math.pow( value, 4.0 );
} );
gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
  bloomPass.threshold = Number( value );
} );
gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
  bloomPass.strength = Number( value );
} );
gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
  bloomPass.radius = Number( value );
} );

export {
  composer
};