import { KeyCode } from '../const.js';

export const isEscapeEvent = (evt) => evt.code === KeyCode.ESCAPE;

export const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
