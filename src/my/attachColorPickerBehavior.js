import { rgb2hex } from "./extensions";

const attachColorPickerBehavior = (el, styleColor = "color") => {
  el.onclick = ev => {
    ev.stopPropagation();
    if (ev.target === el) {
      const colorPicker = document.getElementById("colorPicker");

      colorPicker.value =
        rgb2hex(getComputedStyle(el)[styleColor]) || "#000000";
      colorPicker.select();

      colorPicker.oninput = _ => (el.style[styleColor] = colorPicker.value);
    }
  };
};

export default attachColorPickerBehavior;
