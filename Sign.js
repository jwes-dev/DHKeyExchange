let Url = '';
let Payload = {
    'Name': 'John'
};

class Token {
    constructor(onSecretReady = null) {
        this.Secret = "";
        this.OnSecretReady = onSecretReady;
    }

    GetWheelAndGenerator() {
        window.fetch("./test.php").then(resp => resp.json()).then(body => {
            let wheel = body[0];
            let generator = body[1];
            let Keys = body[2];
            let MyKeys = [];
            let SendKeys = [];
            for (let k of Keys) {
                let x = RandomBetween(0, wheel);
                MyKeys.push(modulo(power(k, x), wheel));
                SendKeys.push(modulo(power(generator, x), wheel));
            }
            this.Secret = MyKeys.join('');
            document.getElementById("output").innerHTML += "<br><br>" + this.Secret;
            if(this.OnSecretReady !== null) {
                this.OnSecretReady();
            }
            window.fetch("./Verify", {
                method: "POST",
                body: JSON.stringify(SendKeys)
            }).then(resp => resp.text()).then(txt => { document.getElementById("output").innerHTML += "<br><br>" + txt; });
        });
    }
}

class AES {
    constructor() {
        this.keySize = 256;
        this.ivSize = 128;
        this.iterations = 100;
    }
    Encrypt(msg, pass) {
        var salt = CryptoJS.lib.WordArray.random(128 / 8);

        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations
        });

        var iv = CryptoJS.lib.WordArray.random(128 / 8);

        var encrypted = CryptoJS.AES.encrypt(msg, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC

        });

        // salt, iv will be hex 32 in length
        // append them to the ciphertext for use  in decryption
        var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
        return transitmessage;
    }

    Decrypt(transitmessage, pass) {
        var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
        var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
        var encrypted = transitmessage.substring(64);

        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations
        });

        var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC

        })
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}


let t = new Token();
t.GetWheelAndGenerator();
// let aes = new AES();
// var message = "Hello World";
// t.OnSecretReady = function () {
//     var encrypted = aes.Encrypt(message, t.Secret);
//     alert(aes.Decrypt(encrypted, t.Secret));
// }






let MAX = 100000;
function multiply(x, res, res_size) {
    let carry = 0;
    for (let i = 0; i < res_size; i++) {
        let prod = res[i] * x + carry;
        res[i] = prod % 10;
        carry = Math.floor(prod / 10);
    }
    while (carry) {
        res[res_size] = carry % 10;
        carry = Math.floor(carry / 10);
        res_size++;
    }
    return res_size;
}
function power(x, n) {
    if (n == 0) {
        return;
    }
    let res = new Array(MAX);
    let res_size = 0;
    let temp = x;
    while (temp != 0) {
        res[res_size++] = temp % 10;
        temp = Math.floor(temp / 10);
    }
    for (let i = 2; i <= n; i++)
        res_size = multiply(x, res, res_size);

    let out = [];
    for (let i = res_size - 1; i >= 0; i--)
        out.push(res[i]);
    return out.join('');
}

function modulo(divident, divisor) {
    var cDivident = '';
    var cRest = '';

    for (var i in divident) {
        var cChar = divident[i];
        var cOperator = cRest + '' + cDivident + '' + cChar;

        if (cOperator < parseInt(divisor)) {
            cDivident += '' + cChar;
        } else {
            cRest = cOperator % divisor;
            if (cRest == 0) {
                cRest = '';
            }
            cDivident = '';
        }

    }
    cRest += '' + cDivident;
    if (cRest == '') {
        cRest = 0;
    }
    return cRest;
}

function RandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}