import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { IPlayerRepository } from '../interfaces/player-repository.interface';

/**
 * Implementación del Repositorio de Jugador
 * Principios SOLID:
 * - S (Responsabilidad Única): Solo maneja acceso a datos de jugadores
 * - D (Inversión de Dependencias): Implementa la interfaz IPlayerRepository
 * - L (Sustitución de Liskov): Puede ser sustituido por cualquier implementación de IPlayerRepository
 */
@Injectable()
export class PlayerRepository implements IPlayerRepository {
  constructor(
    @InjectRepository(Player)
    private readonly repository: Repository<Player>,
  ) {}

  async create(username: string, email: string): Promise<Player> {
    const player = this.repository.create({ username, email });
    return this.repository.save(player);
  }

  async createWithPassword(username: string, email: string, hashedPassword: string): Promise<Player> {
    const player = this.repository.create({ 
      username, 
      email, 
      password: hashedPassword,
      mustChangePassword: true 
    });
    return this.repository.save(player);
  }

  async updatePassword(playerId: string, hashedPassword: string, mustChangePassword: boolean): Promise<Player> {
    const player = await this.getPlayerOrThrow(playerId);
    player.password = hashedPassword;
    player.mustChangePassword = mustChangePassword;
    return this.repository.save(player);
  }

  async findById(id: string): Promise<Player | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<Player | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<Player | null> {
    return this.repository.findOne({ where: { email } });
  }

  async updateMonsterKills(playerId: string, increment: number): Promise<Player> {
    const player = await this.getPlayerOrThrow(playerId);
    player.monstersKilled += increment;
    return this.repository.save(player);
  }

  async updateTimePlayed(playerId: string, increment: number): Promise<Player> {
    const player = await this.getPlayerOrThrow(playerId);
    player.timePlayed += increment;
    return this.repository.save(player);
  }

  async findAll(): Promise<Player[]> {
    return this.repository.find({ where: { isActive: true } });
  }

  async update(id: string, username?: string, email?: string): Promise<Player> {
    const player = await this.getPlayerOrThrow(id);
    
    if (username) player.username = username;
    if (email) player.email = email;
    
    return this.repository.save(player);
  }

  async delete(id: string): Promise<void> {
    const player = await this.getPlayerOrThrow(id);
    player.isActive = false;
    await this.repository.save(player);
  }

  /**
   * Método privado auxiliar para obtener jugador o lanzar error
   * Elimina duplicación de código en validación de existencia
   */
  private async getPlayerOrThrow(id: string): Promise<Player> {
    const player = await this.findById(id);
    if (!player) {
      throw new Error('Player not found');
    }
    return player;
  }
}