import chalk from 'chalk';// Corrigido para o chalk
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
      'Buscar lojas mais procimas independente da distancia',
      'Loja mais próximas no rai de 100 KM',
      'Sair',
    ],
  }])
  .then((resposta) => {
    const action = resposta['action'];

    if (action === 'Adicionar Loja') {
      adicionarLoja();
    } else if (action === 'Buscar loja por CEP') {
      buscarLoja();
    } else if (action === 'Buscar lojas mais procimas independente da distancia') {
      lojasIndependentesDADistancia();
    } else if (action === 'Loja mais próximas no rai de 100 KM') {
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

function lojasIndependentesDADistancia(): void {
  inquirer.prompt([{
    name: 'cep',
    message: 'Digite o CEP da sua localização:',
  }])
    .then((resposta) => {
      const cep = resposta.cep;

      // Valida o CEP via API ViaCEP e obtém a latitude e longitude
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
              const userLocation = geocodeResponse.data.results[0]?.geometry.location;

              if (!userLocation) {
                console.log(chalk.bgRed.black('Não foi possível obter coordenadas para este CEP.'));
                operation();
                return;
              }

              const { lat: userLat, lng: userLng } = userLocation;

              // Lê o arquivo de lojas e processa as lojas
              const filePath = 'src/lojas.json';
              if (!fs.existsSync(filePath)) {
                console.log(chalk.bgRed.black('Nenhuma loja cadastrada.'));
                operation();
                return;
              }

              const lojas: Loja[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

              if (lojas.length === 0) {
                console.log(chalk.bgRed.black('Nenhuma loja cadastrada.'));
                operation();
                return;
              }

              const lojasDistancias: { loja: Loja, distancia: number }[] = [];

              // Processa cada loja e busca sua latitude/longitude dinamicamente
              const promises = lojas.map(loja => {
                return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${loja.cep}&key=${GOOGLE_API_KEY}`)
                  .then(geocodeRes => {
                    const lojaLocation = geocodeRes.data.results[0]?.geometry.location;

                    if (lojaLocation) {
                      const { lat: lojaLat, lng: lojaLng } = lojaLocation;
                      const distancia = calcularDistancia(userLat, userLng, lojaLat, lojaLng);

                      // Armazena a loja e sua distância
                      lojasDistancias.push({ loja, distancia });
                    }
                  })
                  .catch(() => {
                    console.log(chalk.bgRed.black(`Erro ao obter coordenadas da loja ${loja.nome}`));
                  });
              });

              // Aguarda a resolução de todas as requisições para as lojas
              Promise.all(promises).then(() => {
                // Ordena as lojas pela distância em ordem crescente
                lojasDistancias.sort((a, b) => a.distancia - b.distancia);

                // Exibe a loja mais próxima e a segunda mais próxima
                if (lojasDistancias.length > 0) {
                  console.log(chalk.green(`Loja mais próxima:`));
                  const lojaMaisProxima = lojasDistancias[0];
                  console.log(`\nLoja: ${lojaMaisProxima.loja.nome}`);
                  console.log(`Endereço: ${lojaMaisProxima.loja.endereco}`);
                  console.log(`Telefone: ${lojaMaisProxima.loja.telefone}`);
                  console.log(`Distância: ${(lojaMaisProxima.distancia / 1000).toFixed(2)} km`);

                  if (lojasDistancias.length > 1) {
                    console.log(chalk.green(`\nSegunda loja mais próxima:`));
                    const segundaMaisProxima = lojasDistancias[1];
                    console.log(`\nLoja: ${segundaMaisProxima.loja.nome}`);
                    console.log(`Endereço: ${segundaMaisProxima.loja.endereco}`);
                    console.log(`Telefone: ${segundaMaisProxima.loja.telefone}`);
                    console.log(`Distância: ${(segundaMaisProxima.distancia / 1000).toFixed(2)} km`);
                  } else {
                    console.log(chalk.yellow('\nNão há uma segunda loja cadastrada.'));
                  }
                } else {
                  console.log(chalk.bgRed.black('Nenhuma loja cadastrada.'));
                }

                operation();
              });
            })
            .catch(() => {
              console.log(chalk.bgRed.black('Erro ao buscar coordenadas geográficas para o CEP.'));
              operation();
            });
        })
        .catch(() => {
          console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'));
          operation();
        });
    })
    .catch((err) => console.log(err));
}



function lojaMaisProxima(): void {
  inquirer.prompt([{
    name: 'cep',
    message: 'Digite o CEP da sua localização:',
  }])
    .then((resposta) => {
      const cep = resposta.cep;

      // Valida o CEP via API ViaCEP e obtém a latitude e longitude
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
              const userLocation = geocodeResponse.data.results[0]?.geometry.location;

              if (!userLocation) {
                console.log(chalk.bgRed.black('Não foi possível obter coordenadas para este CEP.'));
                operation();
                return;
              }

              const { lat: userLat, lng: userLng } = userLocation;

              // Lê o arquivo de lojas e encontra as lojas próximas
              const filePath = 'src/lojas.json';
              if (!fs.existsSync(filePath)) {
                console.log(chalk.bgRed.black('Nenhuma loja cadastrada.'));
                operation();
                return;
              }

              const lojas: Loja[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

              if (lojas.length === 0) {
                console.log(chalk.bgRed.black('Nenhuma loja cadastrada.'));
                operation();
                return;
              }

              const lojasProximas: { loja: Loja, distancia: number }[] = [];

              // Processa cada loja e busca sua latitude/longitude dinamicamente
              const promises = lojas.map(loja => {
                return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${loja.cep}&key=${GOOGLE_API_KEY}`)
                  .then(geocodeRes => {
                    const lojaLocation = geocodeRes.data.results[0]?.geometry.location;

                    if (lojaLocation) {
                      const { lat: lojaLat, lng: lojaLng } = lojaLocation;
                      const distancia = calcularDistancia(userLat, userLng, lojaLat, lojaLng);

                      // Filtra lojas com distância menor que 100 KM (100000 metros)
                      if (distancia <= 100000) {
                        lojasProximas.push({ loja, distancia });
                      }
                    }
                  })
                  .catch(() => {
                    console.log(chalk.bgRed.black(`Erro ao obter coordenadas da loja ${loja.nome}`));
                  });
              });

              // Aguarda a resolução de todas as requisições para as lojas
              Promise.all(promises).then(() => {
                if (lojasProximas.length > 0) {
                  console.log(chalk.green(`Lojas encontradas a menos de 100 KM:`));
                  lojasProximas.forEach((item) => {
                    console.log(`\nLoja: ${item.loja.nome}`);
                    console.log(`Endereço: ${item.loja.endereco}`);
                    console.log(`Telefone: ${item.loja.telefone}`);
                    console.log(`Distância: ${(item.distancia / 1000).toFixed(2)} km`);
                  });
                } else {
                  console.log(chalk.bgRed.black('Nenhuma loja encontrada a menos de 100 KM.'));
                }

                operation();
              });
            })
            .catch(() => {
              console.log(chalk.bgRed.black('Erro ao buscar coordenadas geográficas para o CEP.'));
              operation();
            });
        })
        .catch(() => {
          console.log(chalk.bgRed.black('Erro ao buscar o CEP na API ViaCEP.'));
          operation();
        });
    })
    .catch((err) => console.log(err));
}

// Função para calcular a distância entre duas coordenadas geográficas usando a fórmula de Haversine
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distância em metros
}

