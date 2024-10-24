"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk"); // Corrigido para o chalk
var fs = require("fs"); // Corrigido para o fs
var axios_1 = require("axios");
var inquirer_1 = require("inquirer");
var GOOGLE_API_KEY = 'AIzaSyB5g21g_24mfguxVZBd4si9G8NufHpVq5E';
function testarChaveApi() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(chalk.blue('Testando a chave da API do Google...')); // Log de depuração
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("https://maps.googleapis.com/maps/api/geocode/json?address=S\u00E3o+Paulo&key=".concat(GOOGLE_API_KEY))];
                case 2:
                    response = _a.sent();
                    if (response.data.status === "OK") {
                        console.log(chalk.green('Chave da API do Google funcionando corretamente.'));
                    }
                    else {
                        console.log(chalk.bgRed.black('Chave da API do Google não é válida.'));
                        process.exit(1);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log(chalk.bgRed.black('Erro ao testar a chave da API:'), error_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Chama a função para testar a chave da API
testarChaveApi().then(function () {
    // Inicializa o menu principal
    operation();
});
// Inicializa o menu principal
operation();
function operation() {
    inquirer_1.default.prompt([{
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Adicionar Loja',
                'Buscar loja por CEP',
                'Buscar lojas no raio de 100 KM',
                'Loja mais próxima',
                'Sair',
            ],
        }])
        .then(function (resposta) {
        var action = resposta['action'];
        if (action === 'Adicionar Loja') {
            adicionarLoja();
        }
        else if (action === 'Buscar loja por CEP') {
            buscarLoja();
        }
        else if (action === 'Buscar lojas no raio de 100 KM') {
            buscar_100KM();
        }
        else if (action === 'Loja mais próxima') {
            lojaMaisProxima();
        }
        else if (action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o sistema de lojas físicas!'));
            process.exit();
        }
    })
        .catch(function (err) { return console.log(err); });
}
// Função para adicionar uma nova loja
function adicionarLoja() {
    inquirer_1.default.prompt([{
            name: 'nome',
            message: 'Digite o nome da loja:',
        },
        {
            name: 'endereco',
            message: 'Digite o endereço da loja:',
        },
        {
            name: 'cep',
            message: 'Digite o CEP da loja:',
        },
        {
            name: 'telefone',
            message: 'Digite o telefone da loja:',
        }])
        .then(function (resposta) {
        var loja = {
            nome: resposta.nome,
            endereco: resposta.endereco,
            cep: resposta.cep,
            telefone: resposta.telefone,
        };
        var filePath = 'src/lojas.json';
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
        }
        var lojas = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        lojas.push(loja);
        fs.writeFileSync(filePath, JSON.stringify(lojas, null, 2));
        console.log(chalk.green('Loja adicionada com sucesso!'));
        operation();
    })
        .catch(function (err) { return console.log(err); });
}
// Função para buscar uma loja pelo CEP
function buscarLoja() {
    inquirer_1.default.prompt([{
            name: 'cep',
            message: 'Digite o CEP da loja que deseja buscar:',
        }])
        .then(function (resposta) {
        var cep = resposta.cep;
        // Valida CEP via API ViaCEP
        axios_1.default.get("https://viacep.com.br/ws/".concat(cep, "/json/"))
            .then(function (response) {
            if (response.data.erro) {
                console.log(chalk.bgRed.black('CEP inválido!'));
                operation();
                return;
            }
            // Verifica se a loja está cadastrada com esse CEP
            buscarLojaPorCEP(cep);
        })
            .catch(function (err) {
            console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'), err);
            operation();
        });
    })
        .catch(function (err) { return console.log(err); });
}
// Função para buscar a loja no arquivo JSON por CEP
function buscarLojaPorCEP(cep) {
    var filePath = 'src/lojas.json';
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            console.log(chalk.bgRed.black('Erro ao ler o arquivo de lojas.'));
            return;
        }
        var lojas = JSON.parse(data);
        var lojaEncontrada = lojas.find(function (loja) { return loja.cep === cep; });
        if (lojaEncontrada) {
            console.log(chalk.green("Loja encontrada: ".concat(lojaEncontrada.nome)));
            console.log("Endere\u00E7o: ".concat(lojaEncontrada.endereco));
            console.log("CEP: ".concat(lojaEncontrada.cep));
            console.log("Telefone: ".concat(lojaEncontrada.telefone));
        }
        else {
            console.log(chalk.bgRed.black('Nenhuma loja encontrada com esse CEP.'));
        }
        operation();
    });
}
function buscar_100KM() {
    inquirer_1.default.prompt([{
            name: 'cep',
            message: 'Digite o CEP da localização:',
        }])
        .then(function (resposta) {
        var cep = resposta.cep;
        // Valida CEP via API ViaCEP
        axios_1.default.get("https://viacep.com.br/ws/".concat(cep, "/json/"))
            .then(function (response) {
            if (response.data.erro) {
                console.log(chalk.bgRed.black('CEP inválido!'));
                operation();
                return;
            }
            // Usar a API de Geocoding do Google para obter a latitude e longitude a partir do CEP
            axios_1.default.get("https://maps.googleapis.com/maps/api/geocode/json?address=".concat(cep, "&key=").concat(GOOGLE_API_KEY))
                .then(function (geocodeResponse) {
                var _a;
                var location = (_a = geocodeResponse.data.results[0]) === null || _a === void 0 ? void 0 : _a.geometry.location;
                if (!location) {
                    console.log(chalk.bgRed.black('Não foi possível obter coordenadas para este CEP.'));
                    operation();
                    return;
                }
                var lat = location.lat, lng = location.lng;
                // Busca lojas na área de 100 KM utilizando a API Google Places
                axios_1.default.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=".concat(lat, ",").concat(lng, "&radius=100000&type=store&key=").concat(GOOGLE_API_KEY))
                    .then(function (placesResponse) {
                    var lojas = placesResponse.data.results;
                    if (lojas.length > 0) {
                        console.log(chalk.green('Lojas encontradas:'));
                        lojas.forEach(function (loja) {
                            console.log("Nome: ".concat(loja.name, ", Endere\u00E7o: ").concat(loja.vicinity));
                        });
                    }
                    else {
                        console.log(chalk.bgRed.black('Nenhuma loja encontrada em um raio de 100 km.'));
                    }
                    operation();
                })
                    .catch(function (err) {
                    console.log(chalk.bgRed.black('Erro ao buscar lojas próximas.'));
                    operation();
                });
            })
                .catch(function (err) {
                console.log(chalk.bgRed.black('Erro ao buscar coordenadas geográficas para o CEP.'));
                operation();
            });
        })
            .catch(function (err) {
            console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'));
            operation();
        });
    })
        .catch(function (err) { return console.log(err); });
}
// Inicializa o menu principal
operation();
// Função para encontrar a loja mais próxima
function lojaMaisProxima() {
    inquirer_1.default.prompt([{
            name: 'cep',
            message: 'Digite o CEP da sua localização:',
        }])
        .then(function (resposta) {
        var cep = resposta.cep;
        // Valida CEP via API ViaCEP
        axios_1.default.get("https://viacep.com.br/ws/".concat(cep, "/json/"))
            .then(function (response) {
            if (response.data.erro) {
                console.log(chalk.bgRed.black('CEP inválido!'));
                operation();
                return;
            }
            var _a = response.data, latitude = _a.latitude, longitude = _a.longitude; // Supondo que a API retorne a latitude e longitude
            // Busca lojas na área
            axios_1.default.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=".concat(latitude, ",").concat(longitude, "&radius=5000&type=store&key=").concat(GOOGLE_API_KEY))
                .then(function (response) {
                if (response.data.results.length > 0) {
                    var lojaMaisProxima_1 = response.data.results[0]; // A primeira loja da lista é a mais próxima
                    console.log(chalk.green("A loja mais pr\u00F3xima \u00E9: ".concat(lojaMaisProxima_1.name)));
                    console.log("Endere\u00E7o: ".concat(lojaMaisProxima_1.vicinity));
                }
                else {
                    console.log(chalk.bgRed.black('Nenhuma loja encontrada nas proximidades.'));
                }
                operation();
            })
                .catch(function (err) {
                console.log(chalk.bgRed.black('Erro ao buscar lojas próximas.'));
                operation();
            });
        })
            .catch(function (err) {
            console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'));
            operation();
        });
    })
        .catch(function (err) { return console.log(err); });
}
