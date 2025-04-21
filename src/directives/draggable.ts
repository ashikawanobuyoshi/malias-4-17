import { DirectiveBinding } from 'vue';

interface Position {
  x: number;
  y: number;
}

const draggable = {
  mounted(el: HTMLElement, binding: DirectiveBinding<any>) {
    let startPosition: Position;
    let isDragging = false;

    el.style.position = 'absolute';
    el.style.cursor = 'move';

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      startPosition = {
        x: el.offsetLeft - event.clientX,
        y: el.offsetTop - event.clientY,
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        el.style.left = event.clientX + startPosition.x + 'px';
        el.style.top = event.clientY + startPosition.y + 'px';
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    el.addEventListener('mousedown', onMouseDown);
  },
  beforeUnmount(el: HTMLElement) {
    el.removeEventListener('mousedown', () => {});
  },
};

export default draggable;

