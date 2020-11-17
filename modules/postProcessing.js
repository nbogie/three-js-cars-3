import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { EffectComposer } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/EffectComposer.js';
import { BloomPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/BloomPass.js';
import { RenderPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/GlitchPass.js';
import { BokehPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/BokehPass.js';

export function setupPostProcessingComposer(renderer, scene, camera) {
  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new BloomPass(
    1,    // strength
    25,   // kernel size
    4,    // sigma ?
    256,  // blur render target resolution
  );

  const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  unrealBloomPass.threshold = 0; //params.bloomThreshold;
  unrealBloomPass.strength = 10.1; //params.bloomStrength;
  unrealBloomPass.radius = 0; //params.bloomRadius;


  const glitchPass = new GlitchPass();
  glitchPass.goWild = false;

  const bokehPass = new BokehPass(scene, camera, {
    focus: 15.0,
    aperture: 0.025,
    maxblur: 0.01,

    width: window.innerWidth,
    height: window.innerHeight
  });

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(glitchPass); //glitch pass works
  composer.addPass(bokehPass); //bokehpass (DOF) works
  // composer.addPass(bloomPass);  
  //composer.addPass(unrealBloomPass);  

  function turnOff() {
    glitchPass.enabled = false;
    bokehPass.enabled = false;
  }
  function turnOn() {
    glitchPass.enabled = true;
    bokehPass.enabled = true;
  }
  setTimeout(turnOff, 5000);
  const functions = { turnOn, turnOff };

  // unrealBloomPass.renderToScreen = true;
  return { composer, functions };
}
