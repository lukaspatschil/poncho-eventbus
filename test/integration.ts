import {EventBus} from '../lib';

const eventBus = new EventBus();
const listenerButton = document.getElementById('listener');
const clearButton = document.getElementById('clear');

listenerButton.addEventListener('click', () => {
    for (let i = 0; i < 1000; i++) {
        eventBus.on('test', () => console.log('listening'));
    }
    console.log('Added 1000 listeners!');
});

clearButton.addEventListener('click', () => eventBus.clear());
