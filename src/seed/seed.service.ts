import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=100',
    );

    const pokemonList: CreatePokemonDto[] = data.results.map(
      ({ name, url }) => {
        const segmentos = url.split('/');
        const number = +segmentos[segmentos.length - 2];
        return { name, no: number };
      },
    );

    await this.pokemonService.fillPokemonsWithSeedData(pokemonList);
    return 'Seed executed';
  }
}
