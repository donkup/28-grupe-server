import { ajax } from "./ajax.js";

const formMessageDOM = document.querySelector('.form-messages');
const pFormMessageDOM = formMessageDOM.querySelector('.message');
const closeMessageDOM = formMessageDOM.querySelector('.close');
const formDOM = document.querySelector('.form');
const serviceNameDOM = document.getElementById('service_name');
const urlSlugDOM = document.getElementById('slug');
const shortDescDOM = document.getElementById('short_desc');
const fullDescDOM = document.getElementById('full_desc');
const priceDOM = document.getElementById('price');
const isActiveDOM = document.getElementById('is_active');
const submitDOM = document.querySelector('button');

function showMessage(state, msg) {
    const allowedStates = ['info', 'success', 'error'];
    if (allowedStates.includes(state)) {
        formMessageDOM.classList.add('show');
        formMessageDOM.dataset.state = state;
        pFormMessageDOM.innerText = msg;
    }
}

function closeMessage() {
    formMessageDOM.classList.remove('show');
}

function submitFormInfo(e) {
    e.preventDefault();

    const serviceName = serviceNameDOM.value;
    const urlSlug = urlSlugDOM.value;
    const shortDesc = shortDescDOM.value;
    const fullDesc = fullDescDOM.value;
    const price = priceDOM.value;
    const isActive = isActiveDOM.checked;

    if (isActive) {
        if (serviceName === '') {
            return showMessage('error', '"ServiceName" negali buti tuscias');
        }
        if (urlSlug === '') {
            return showMessage('error', '"UrlSlug" negali buti tuscias');
        }
        if (shortDesc === '') {
            return showMessage('error', '"ShortDesc" negali buti tuscias');
        }
        if (fullDesc === '') {
            return showMessage('error', '"FullDesc" negali buti tuscias');
        }
        if (price === '') {
            return showMessage('error', '"Price" negali buti tuscias');
        }
    } else {
        if (serviceName === '') {
            return showMessage('error', '"ServiceName" negali buti tuscias');
        }
        if (urlSlug === '') {
            return showMessage('error', '"UrlSlug" negali buti tuscias');
        }
    }


    closeMessage();
    ajax({
        method: 'POST',
        headers: {},
        endpoint: 'api/services',
        data: { serviceName, urlSlug, shortDesc, fullDesc, price, isActive }
    }, responseAction);
}

function responseAction(response) {
    try {
        const responseObject = JSON.parse(response);
        if (responseObject.error) {
            showMessage('error', responseObject.error);
        }
        showMessage('success', 'Paslauga sekmingai prideta!');

        location.href = '/admin/services';

    } catch (error) {
        showMessage('error', 'Serverio klaida!');
    }
}

closeMessageDOM.addEventListener('click', closeMessage);

submitDOM.addEventListener('click', submitFormInfo);

// showMessage('info', 'Labas');
// showMessage('success', 'Tau pavyko!');
// showMessage('error', 'Kazkur yra klaida!');