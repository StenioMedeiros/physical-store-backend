import * as chalk from 'chalk'; // Corrigido para o chalk
import * as fs from 'fs'; // Corrigido para o fs
import axios from 'axios';
import inquirer from 'inquirer';


// Definição do tipo Loja
interface Loja {
  nome: string;
  endereco: string;
  cep: string;
  telefone: string;
}

const GOOGLE_API_KEY = 'AIzaSyB5g21g_24mfguxVZBd4si9G8NufHpVq5E'


async function testarChaveApi(): Promise<void> {
  console.log(chalk.blue('Testando a chave da API do Google...')); // Log de depuração
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=São+Paulo&key=${GOOGLE_API_KEY}`);
    
    if (response.data.status === "OK") {
      console.log(chalk.green('Chave da API do Google funcionando corretamente.'));
    } else {
      console.log(chalk.bgRed.black('Chave da API do Google não é válida.'));
      process.exit(1);
    }
  } catch (error) {
    console.log(chalk.bgRed.black('Erro ao testar a chave da API:'), error);
    process.exit(1);
  }
}

// Chama a função para testar a chave da API
testarChaveApi().then(() => {
  // Inicializa o menu principal
  operation();
});

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
    const loja: Loja = {
      nome: resposta.nome,
      endereco: resposta.endereco,
      cep: resposta.cep,
      telefone: resposta.telefone,
    };

    const filePath = 'src/lojas.json';

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]');
    }

    const lojas: Loja[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
        console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'),err);
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

    let lojas: Loja[] = JSON.parse(data);

    const lojaEncontrada = lojas.find((loja: Loja) => loja.cep === cep);

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

// Função para buscar lojas no raio de 100 KM

interface LojaGoogle {
  name: string;
  vicinity: string;
}

function buscar_100KM(): void {
  inquirer.prompt([{
    name: 'cep',
    message: 'Digite o CEP da localização:',
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

        // Usar a API de Geocoding do Google para obter a latitude e longitude a partir do CEP
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${GOOGLE_API_KEY}`)
          .then((geocodeResponse) => {
            const location = geocodeResponse.data.results[0]?.geometry.location;

            if (!location) {
              console.log(chalk.bgRed.black('Não foi possível obter coordenadas para este CEP.'));
              operation();
              return;
            }

            const { lat, lng } = location;

            // Busca lojas na área de 100 KM utilizando a API Google Places
            axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=100000&type=store&key=${GOOGLE_API_KEY}`)
              .then((placesResponse) => {
                const lojas: LojaGoogle[] = placesResponse.data.results;

                if (lojas.length > 0) {
                  console.log(chalk.green('Lojas encontradas:'));
                  lojas.forEach((loja: LojaGoogle) => {
                    console.log(`Nome: ${loja.name}, Endereço: ${loja.vicinity}`);
                  });
                } else {
                  console.log(chalk.bgRed.black('Nenhuma loja encontrada em um raio de 100 km.'));
                }
                operation();
              })
              .catch((err) => {
                console.log(chalk.bgRed.black('Erro ao buscar lojas próximas.'));
                operation();
              });
          })
          .catch((err) => {
            console.log(chalk.bgRed.black('Erro ao buscar coordenadas geográficas para o CEP.'));
            operation();
          });
      })
      .catch((err) => {
        console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'));
        operation();
      });
  })
  .catch((err) => console.log(err));
}


// Inicializa o menu principal
operation();


// Função para encontrar a loja mais próxima
function lojaMaisProxima(): void {
  inquirer.prompt([{
    name: 'cep',
    message: 'Digite o CEP da sua localização:',
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

        const { latitude, longitude } = response.data; // Supondo que a API retorne a latitude e longitude

        // Busca lojas na área
        axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=store&key=${GOOGLE_API_KEY}`)
          .then(response => {
            if (response.data.results.length > 0) {
              const lojaMaisProxima = response.data.results[0]; // A primeira loja da lista é a mais próxima
              console.log(chalk.green(`A loja mais próxima é: ${lojaMaisProxima.name}`));
              console.log(`Endereço: ${lojaMaisProxima.vicinity}`);
            } else {
              console.log(chalk.bgRed.black('Nenhuma loja encontrada nas proximidades.'));
            }
            operation();
          })
          .catch(err => {
            console.log(chalk.bgRed.black('Erro ao buscar lojas próximas.'));
            operation();
          });
      })
      .catch((err) => {
        console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'));
        operation();
      });
  })
  .catch((err) => console.log(err));
}



