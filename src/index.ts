import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import axios from 'axios';

// Inicializa o menu principal
operation();

function operation(): void {
  inquirer.prompt([{
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
    const action = resposta['action'];

    if (action === 'Adicionar Loja') {
      adicionarLoja();
    } else if (action === 'Buscar loja por CEP') {
      buscarLoja();
    } else if (action === 'Buscar lojas no raio de 100 KM') {
      buscar_100KM();
    } else if (action === 'Loja mais próxima') {
      lojaMaisProxima();
    } else if (action === 'Sair') {
      console.log(chalk.bgBlue.black('Obrigado por usar o sistema de lojas físicas!'));
      process.exit();
    }
  })
  .catch((err) => console.log(err));
}

// Função para adicionar uma nova loja
function adicionarLoja(): void {
  inquirer.prompt([{
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
  .then((resposta) => {
    const loja = {
      nome: resposta.nome,
      endereco: resposta.endereco,
      cep: resposta.cep,
      telefone: resposta.telefone,
    };

    const filePath = 'src/lojas.json';

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]');
    }

    const lojas = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    lojas.push(loja);
    fs.writeFileSync(filePath, JSON.stringify(lojas, null, 2));

    console.log(chalk.green('Loja adicionada com sucesso!'));
    operation();
  })
  .catch((err) => console.log(err));
}

// Função para buscar uma loja pelo CEP
function buscarLoja(): void {
  inquirer.prompt([{
    name: 'cep',
    message: 'Digite o CEP da loja que deseja buscar:',
  }])
  .then((resposta) => {
    const cep = resposta.cep;

    // Valida CEP via API ViaCEP
    axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        if (response.data.erro) {
          console.log(chalk.bgRed.black('CEP inválido!'));
          operation();
          return;
        }

        // Verifica se a loja está cadastrada com esse CEP
        buscarLojaPorCEP(cep);
      })
      .catch((err) => {
        console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'));
        operation();
      });
  })
  .catch((err) => console.log(err));
}

// Função para buscar a loja no arquivo JSON por CEP
function buscarLojaPorCEP(cep: string): void {
  const filePath = 'src/lojas.json';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(chalk.bgRed.black('Erro ao ler o arquivo de lojas.'));
      return;
    }

    let lojas = JSON.parse(data);

    const lojaEncontrada = lojas.find((loja: { cep: string }) => loja.cep === cep);

    if (lojaEncontrada) {
      console.log(chalk.green(`Loja encontrada: ${lojaEncontrada.nome}`));
      console.log(`Endereço: ${lojaEncontrada.endereco}`);
      console.log(`CEP: ${lojaEncontrada.cep}`);
      console.log(`Telefone: ${lojaEncontrada.telefone}`);
    } else {
      console.log(chalk.bgRed.black('Nenhuma loja encontrada com esse CEP.'));
    }

    operation();
  });
}

// Funções placeholder para outras opções do menu
function buscar_100KM(): void {
  console.log(chalk.yellow('Função ainda não implementada.'));
  operation(); 
}

function lojaMaisProxima(): void {
  console.log(chalk.yellow('Função ainda não implementada.'));
  operation();
}
