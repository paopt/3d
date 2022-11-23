import * as THREE from '../../build/three.module.js';
import config from './config.js';

/**
 * 创建地球光晕，使用精灵实现，总是面向摄像机
 */
function createHalo() {
  const map = new THREE.TextureLoader().load( "halo.png" );
  const material = new THREE.SpriteMaterial({
    map,
    transparent: true,
  });
  const sprite = new THREE.Sprite( material );
  sprite.scale.set(config.R * 3, config.R * 3, 1);
  return sprite;
}

export {
  createHalo
};