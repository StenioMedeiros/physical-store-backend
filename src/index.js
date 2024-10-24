"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
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
        .then((resposta) => {
        const action = resposta.action;
        switch (action) {
            case 'Adicionar Loja':
                adicionarLoja();
                break;
            case 'Buscar loja por CEP':
                buscarLoja();
                break;
            case 'Buscar lojas no raio de 100 KM':
                buscar_100KM();
                break;
            case 'Loja mais próxima':
                lojaMaisProxima();
                break;
            case 'Sair':
                console.log(chalk_1.default.bgBlue.black('Obrigado por usar o sistema de lojas físicas!'));
                process.exit();
        }
    })
        .catch((err) => console.error(chalk_1.default.bgRed.black(err.message)));
}
// Função para adicionar uma nova loja
function adicionarLoja() {
    inquirer_1.default.prompt([
        { name: 'nome', message: 'Digite o nome da loja:' },
        { name: 'endereco', message: 'Digite o endereço da loja:' },
        { name: 'cep', message: 'Digite o CEP da loja:' },
        { name: 'telefone', message: 'Digite o telefone da loja:' }
    ])
        .then((resposta) => {
        const loja = {
            nome: resposta.nome,
            endereco: resposta.endereco,
            cep: resposta.cep,
            telefone: resposta.telefone,
        };
        const filePath = 'src/lojas.json';
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify([]));
        }
        const lojas = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
        lojas.push(loja);
        fs_1.default.writeFileSync(filePath, JSON.stringify(lojas, null, 2));
        console.log(chalk_1.default.green('Loja adicionada com sucesso!'));
        operation();
    })
        .catch((err) => console.error(chalk_1.default.bgRed.black(err.message)));
}
// Função para buscar uma loja pelo CEP
function buscarLoja() {
    inquirer_1.default.prompt([{
            name: 'cep',
            message: 'Digite o CEP da loja que deseja buscar:'
        }])
        .then((resposta) => {
        const cep = resposta.cep;
        // Valida CEP via API ViaCEP
        axios_1.default.get(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
            if (response.data.erro) {
                console.log(chalk_1.default.bgRed.black('CEP inválido!'));
                operation();
                return;
            }
            // Verifica se a loja está cadastrada com esse CEP
            buscarLojaPorCEP(cep);
        })
            .catch(err => {
            console.log(chalk_1.default.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'));
            operation();
        });
    })
        .catch((err) => console.error(chalk_1.default.bgRed.black(err.message)));
}
// Função para buscar a loja no arquivo JSON por CEP
function buscarLojaPorCEP(cep) {
    fs_1.default.readFile('src/lojas.json', 'utf8', (err, data) => {
        if (err) {
            console.log(chalk_1.default.bgRed.black('Erro ao ler o arquivo de lojas.'));
            return;
        }
        const lojas = JSON.parse(data);
        const lojaEncontrada = lojas.find(loja => loja.cep === cep);
        if (lojaEncontrada) {
            console.log(chalk_1.default.green(`Loja encontrada: ${lojaEncontrada.nome}`));
            console.log(`Endereço: ${lojaEncontrada.endereco}`);
            console.log(`CEP: ${lojaEncontrada.cep}`);
            console.log(`Telefone: ${lojaEncontrada.telefone}`);
        }
        else {
            console.log(chalk_1.default.bgRed.black('Nenhuma loja encontrada com esse CEP.'));
        }
        operation();
    });
}
// Funções placeholder para outras opções do menu
function buscar_100KM() {
    console.log(chalk_1.default.yellow('Função ainda não implementada.'));
    operation();
}
function lojaMaisProxima() {
    console.log(chalk_1.default.yellow('Função ainda não implementada.'));
    operation();
}
