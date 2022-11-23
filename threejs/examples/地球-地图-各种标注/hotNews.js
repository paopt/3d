import * as THREE from '../../build/three.module.js';
import data from './HotNewsData.js';
import config from './config.js';
import {lon2xyz} from './util.js';
import { createPointMark } from './pointMark.js';
import { createLightWave } from './lightWave.js';
import { createBeam } from './beam.js';


const waveArr = [];

/**
 * 获取热点新闻标注
 */
function createHotNewsMark() {
  const hotGroup = new THREE.Group();
  data.forEach(item => {
    const {name, E, N, title, herf} = item;
    const pos = lon2xyz(config.R + 3, E, N);
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);
    hotGroup.add(group);

    // point标注
    group.add(createPointMark());

    // 波动光圈
    const wave = createLightWave();
    group.add(wave);
    waveArr.push(wave);

    // 光柱
    const { plane, plane2 } = createBeam();
    group.add(plane, plane2);

    // 调整group方向
    const v1 = new THREE.Vector3(0, 0, 1);
    const v2 =new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
    group.quaternion.setFromUnitVectors(v1, v2);
  });
  return hotGroup;
}

export {
  createHotNewsMark,
  waveArr
};
