//services/convwerterCep

import { logInfo, logWarn, logError } from 'c:/Users/ESTENIO/prog/estagio-compas/p1.2/E-commerce/bakend/utils/logger';
import axios from 'axios';
import chalk from 'chalk';

interface Coordenadas {
  lat: number;
  lng: number;
}

async function converterCepCoordenadas(cep: string): Promise<Coordenadas | null> {
  logInfo(`Iniciando a conversão do CEP: ${cep}`);

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${process.env.GOOGLE_API_KEY}`);
    logInfo('Resposta da API: ' + JSON.stringify(response.data)); // Convertendo a resposta 

    const lojaLocation = response.data.results[0]?.geometry?.location;

    if (lojaLocation) {
      const { lat, lng } = lojaLocation;
      logInfo(`Coordenadas encontradas para o CEP ${cep}: Latitude ${lat}, Longitude ${lng}`);
      console.log(lat, lng)
      return { lat, lng };
    } else {
      logWarn(`Nenhuma coordenada encontrada para o CEP ${cep}`);
      console.log(chalk.bgRed.black(`Nenhuma coordenada encontrada para o CEP ${cep}`));
      return null;
    }
  } catch (error) {
    logError(`Erro ao obter coordenadas para o CEP ${cep}: ${error instanceof Error ? error.message : error}`);
    console.log(chalk.bgRed.black(`Erro ao obter coordenadas para o CEP ${cep}`));
    return null;
  }
}

export { converterCepCoordenadas };

