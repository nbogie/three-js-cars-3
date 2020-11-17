// Keeps the state of keys/buttons
//
// You can check
//
//   inputManager.keys.left.down
//
// to see if the left key is currently held down
// and you can check
//
//   inputManager.keys.left.justPressed
//
// To see if the left key was pressed this frame
//
// Keys are 'left', 'right', 'a', 'b', 'up', 'down'
export class InputManager {
  constructor() {
    this.keys = {};
    const keyMap = new Map();

    const setKey = (keyName, pressed) => {
      const keyState = this.keys[keyName];
      keyState.justPressed = pressed && !keyState.down;
      keyState.down = pressed;
    };

    const addKey = (keyCode, name) => {
      this.keys[name] = { down: false, justPressed: false };
      keyMap.set(keyCode, name);
    };

    const setKeyFromKeyCode = (keyCode, pressed) => {
      const keyName = keyMap.get(keyCode);
      if (!keyName) {
        return;
      }
      setKey(keyName, pressed);
    };

    addKey(37, 'left');
    addKey(39, 'right');
    addKey(38, 'up');
    addKey(40, 'down');
    addKey(90, 'a'); // 90 is z
    addKey(88, 'b'); // 88 is x
    addKey(82, 'reset'); // 82 is r
    addKey(77, 'randomiseCarMesh'); // 77 is m
    addKey(80, 'pause'); // 77 is m
    addKey(83, 'showSphere'); // 83 is s
    addKey(84, 'changeTexture'); // 84 is t
    addKey(79, 'addRandomObject'); // 79 is o


    window.addEventListener('keydown', (e) => {
      //e.preventDefault();
      setKeyFromKeyCode(e.keyCode, true);
    });
    window.addEventListener('keyup', (e) => {
      //e.preventDefault();
      setKeyFromKeyCode(e.keyCode, false);
    });
  }
  updateAtEndOfFrame() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed) {
        keyState.justPressed = false;
      }
    }
  }
}