const _data = require('../../data');
const helpers = require('../../helpers');

const handlers = {}

handlers.cars = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {
        return handlers._cars[data.httpMethod](data, callback);
    }

    return callback(405, { error: 'Nepriimtinas uzklausos metodas' })
}

handlers._cars = {}

handlers._cars.get = async (data, callback) => {
    // gaunam car info
    const VIN = data.queryStringObject.get('VIN');

    if (VIN === '') {
        return callback(400, {
            error: 'Nenurodytas VIN parametras',
        })
    }

    const content = await _data.read('cars', VIN);
    if (content === '') {
        return callback(400, {
            error: 'Nurodytas automobilis nerastas',
        })
    }

    const contentObj = helpers.parseJsonToObject(content);


    return callback(200, {
        success: contentObj,
    })
}

handlers._cars.post = async (data, callback) => {
    // irasom car info
    const { VIN, model, color } = data.payload;



    const userObject = {
        VIN,
        model,
        color,
    }

    const res = await _data.create('cars', VIN, userObject);

    if (res !== true) {
        return callback(400, {
            error: 'Nepavyko uzregistruoti masinos',
        })
    }

    return callback(200, {
        success: 'Masina uzregistruota',
    })
}

handlers._cars.put = async (data, callback) => {
    // atnaujinam car info
    const { VIN, model, color } = data.payload;

    if (!VIN) {
        return callback(400, {
            error: 'Nenurodytas masinos VIN, kuriai reikia atnaujinti informacija',
        })
    }

    if (!model && !color) {
        return callback(400, {
            error: 'Nenurodyta nei viena reiksme, kuria norima atnaujinti',
        })
    }

    const content = await _data.read('cars', VIN);
    if (content === '') {
        return callback(400, {
            error: 'Nurodyta masina nerasta',
        })
    }

    const contentObj = helpers.parseJsonToObject(content);

    if (color) {
        // atnaujiname color
        contentObj.color = color;
    }

    if (model) {
        // atnaujiname model
        contentObj.model = model;

    }

    const res = await _data.update('cars', VIN, contentObj);

    if (res) {
        return callback(200, {
            success: 'Masinos informacija atnaujinta',
        })
    } else {
        return callback(400, {
            error: 'Ivyko klaida bandant atnaujinti masinos informacija',
        })
    }
}

handlers._cars.delete = async (data, callback) => {
    // istrinam user info
    const VIN = data.queryStringObject.get('VIN');

    if (VIN === '') {
        return callback(400, {
            error: 'Nenurodytas VIN parametras',
        })
    }

    const res = await _data.delete('cars', VIN);
    if (res) {
        return callback(200, {
            success: 'Nurodytas masinos irasas istrintas',
        })
    } else {
        return callback(400, {
            error: 'Ivyko klaida bandant istrinti masinos irasa',
        })
    }
}

module.exports = handlers;