const _data = require('../../data');
const helpers = require('../../helpers');

const handlers = {}

handlers.autos = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {
        return handlers._autos[data.httpMethod](data, callback);
    }

    return callback(405, { error: 'Nepriimtinas uzklausos metodas' })
}

handlers._autos = {}

handlers._autos.get = async (data, callback) => {
    //gaunam autos informacija

    const regNumber = data.queryStringObject.get('regNumber');

    if (regNumber === '') {
        return callback(400, {
            error: 'Nenurodytas valstybinis numeris'
        })
    }

    const content = await _data.read('autos', regNumber);
    if (content === '') {
        return callback(400, {
            error: 'Nurodytas automobilis nerastas'
        })
    }

    contentObj = helpers.parseJsonToObject(content);

    return callback(200, {
        success: contentObj,
    })

}

handlers._autos.post = async (data, callback) => {
    //irasom autos informacija

    const { regNumber } = data.payload;
    // const autosObj = {
    //     regNumber,
    //     brand,
    //     model,
    //     color,
    // }

    const result = await _data.create('autos', regNumber, data.payload);

    if (result !== true) {
        return callback(400, {
            error: `Nepavyko sukurti transporto priemones!`
        })
    }
    return callback(200, {
        success: 'Automobilis sukurtas sekmingai!'
    })

}

handlers._autos.put = async (data, callback) => {
    //atnaujinam autos informacija
    const { regNumber, brand, model, color } = data.payload;

    if (!regNumber) {
        return callback(400, {
            error: 'Nenurodytas automobilio vasltybinis numeris kuriam reikia atnaujinti duomenis'
        })
    }

    if (!brand &&
        !model &&
        !color) {
        return callback(400, {
            error: 'Nenurodytas nei viena reiksme, kuria norima atnaujinti'
        })
    }
    const content = await _data.read('autos', regNumber);

    if (content === '') {
        return callback(400, {
            error: 'Nurodytas automobilis nerastas'
        })
    }

    const contentObj = helpers.parseJsonToObject(content);

    if (brand) {
        //atnaujiname brand
        contentObj.brand = brand;
    }

    if (model) {
        //atnaujinam modeli
        contentObj.model = model;
    }

    if (color) {
        //atnaujiname spalva
        contentObj.color = color;
    }

    const result = _data.update('autos', regNumber, contentObj)

    if (result) {
        return callback(200, {
            success: 'Automobilio informacija atnaujinta'
        })
    } else {
        return callback(400, {
            error: 'Ivyko klaida bandant atnaujinti automobilio informacija'
        })
    }
}

handlers._autos.delete = async (data, callback) => {
    //pasalinam autos informacija pagal reg Numeri
    const regNumber = data.queryStringObject.get('regNumber');

    if (regNumber === '') {
        return callback(400, {
            error: 'Nenurodytas valstybinis numeris'
        })
    }

    const response = await _data.delete('autos', regNumber);
    if (response) {
        return callback(200, {
            success: `Automobilis pasalintas is sistemos`,
        })
    } else {
        return callback(400, {
            error: `Ivyko klaida bandant pasalinti automobili`
        })
    }
}

module.exports = handlers;
